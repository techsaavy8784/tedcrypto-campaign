import { GrantRedelegateClient } from '../../Domain/Grant/GrantRedelegateClient'
import { Coin, coin, DirectSecp256k1HdWallet } from '@cosmjs/proto-signing'
import { SigningStargateClient, coins } from '@cosmjs/stargate'
import { MsgBeginRedelegate } from 'cosmjs-types/cosmos/staking/v1beta1/tx'
import Campaign from '../../Domain/Campaign/Campaign'
import { inject, injectable } from 'inversify'
import { HttpClient } from '../../Domain/Http/HttpClient'
import { TYPES } from '../DependencyInjection/types'
import { shiftDigits } from '../../Application/Shared/calc'
import { getExponentByDenom } from '../../Application/Shared/chain'
import Logger from '../../Application/Logger/Logger'
import { v7 as uuidv7 } from 'uuid'
import { MsgExec } from 'cosmjs-types/cosmos/authz/v1beta1/tx'

export interface Delegation {
  validatorAddress: string
  amount: Coin
  displayAmount: string
}

interface Grant {
  granter: string
  grantee: string
  authorization: {
    '@type': string
    max_tokens: {
      amount: string
      denom: string
    }
    allow_list?: {
      address: string[]
    }
  }
  expiration: string
}

@injectable()
export class CosmosAuthzClient implements GrantRedelegateClient {
  private readonly rpcEndpoint = 'https://rpc.cosmos.directory'
  private readonly restEndpoint = 'https://rest.cosmos.directory'

  constructor (
    @inject(TYPES.HttpClient) private readonly httpClient: HttpClient,
    @inject(TYPES.Logger) private readonly logger: Logger
  ) {
  }

  async execRedelegateGrant (campaign: Campaign, granteeWalletMnemonic: string, granterWalletAddress: string): Promise<void> {
    const loggerContext = {
      correlationId: uuidv7(),
      campaign
    }

    // Step 1: Initialize wallet and client
    const wallet = await DirectSecp256k1HdWallet.fromMnemonic(granteeWalletMnemonic, {
      prefix: 'cosmos'
    })
    const [firstAccount] = await wallet.getAccounts()

    this.logger.info('Connected to wallet', { ...loggerContext, walletAddress: firstAccount.address })

    let client: SigningStargateClient
    try {
      client = await SigningStargateClient.connectWithSigner(`${this.rpcEndpoint}/${campaign.chainName}`, wallet)
    } catch (error) {
      this.logger.error('Error while connecting to client', { ...loggerContext, error })
      throw new Error('Error while connecting to client')
    }

    if (firstAccount.address !== campaign.campaignWalletAddress) {
      this.logger.error(`Wallet address does not match campaign wallet address ${firstAccount.address} !== ${campaign.campaignWalletAddress}`, {
        ...loggerContext
      })
      throw new Error('Wallet address does not match campaign wallet address')
    }

    // Step 2: Check if the grant exists and get one if it does
    const grant = await this.getGrants(campaign.chainName, granterWalletAddress, campaign.campaignWalletAddress)
    if (grant === undefined) {
      this.logger.error('Grant not found', loggerContext)
      throw new Error('Grant not found')
    }
    this.logger.info('Grant found', { ...loggerContext, grant })

    const amount = Number(grant.authorization.max_tokens.amount)

    // Step 3: Check current stake and redelegate
    const delegations = await this.getDelegations(campaign.chainName, granterWalletAddress)
    if (delegations.length === 0) {
      this.logger.error('No delegations found', loggerContext)
      throw new Error('No delegations found')
    }

    this.logger.info('Delegations found', { ...loggerContext, delegations })

    const msgs: Array<{ typeUrl: string, value: Uint8Array }> = []
    let amountLeftToRedelegate = amount
    for (const delegation of delegations) {
      const amountToRedelegate = Math.min(Number(delegation.amount.amount), amountLeftToRedelegate)
      amountLeftToRedelegate -= amountToRedelegate

      this.logger.info(`Redelegating ${amountToRedelegate} ${delegation.amount.denom} from ${delegation.validatorAddress} to ${campaign.validator}`, {
        ...loggerContext,
        amountLeftToRedelegate,
        delegation
      })

      msgs.push({
        typeUrl: '/cosmos.staking.v1beta1.MsgBeginRedelegate',
        value: MsgBeginRedelegate.encode(MsgBeginRedelegate.fromPartial({
          delegatorAddress: granterWalletAddress,
          validatorSrcAddress: delegation.validatorAddress,
          validatorDstAddress: campaign.validator,
          amount: coin(amountToRedelegate, delegation.amount.denom)
        })).finish()
      })

      if (amountLeftToRedelegate <= 0) {
        this.logger.info('Nothing left to redelegate. Stopping now..', loggerContext)
        break
      }
    }

    if (amountLeftToRedelegate > 0) {
      this.logger.error(`Not enough funds to redelegate. Missing ${amountLeftToRedelegate}`, {
        ...loggerContext,
        amountLeftToRedelegate
      })
      throw new Error(`Not enough funds to redelegate. Missing ${amountLeftToRedelegate}`)
    }

    // Step 4: Wrap the message in MsgExec for Authz execution
    const msgExec = {
      typeUrl: '/cosmos.authz.v1beta1.MsgExec',
      value: MsgExec.fromPartial({
        grantee: firstAccount.address,
        msgs
      })
    }

    // Step 4: Broadcast the transaction
    const fee = {
      amount: coins(4500, 'uatom'), // Adjust fee accordingly
      gas: '900000'
    }
    const txResult = await client.signAndBroadcast(firstAccount.address, [msgExec], fee, 'Tedcrypto - Campaign support grantz executed! Thank you for your support <3')
    if (txResult.code !== 0) {
      this.logger.error(`Error while redelegating: ${txResult.rawLog}`, {
        ...loggerContext,
        txResult
      })
      throw new Error(`Error while redelegating: ${txResult.rawLog}`)
    }
    this.logger.info(`Transaction success: ${txResult.transactionHash}`, { ...loggerContext, txResult })
  }

  private async getGrants (chainName: string, address: string, grantee?: string): Promise<Grant | undefined> {
    const url = `${this.restEndpoint}/${chainName}/cosmos/authz/v1beta1/grants/granter/${address}`
    this.logger.info(`Fetching grants from ${url}`)
    const response = await this.httpClient.get(url)

    let grants = response.grants
    if (grants === undefined || grants.length === 0) {
      return undefined
    }

    // Filter by grantee if provided
    if (grantee !== undefined) {
      grants = grants.filter((grant: Grant) => grant.grantee === grantee)
    }

    return grants[0]
  };

  private async getDelegations (chainName: string, address: string): Promise<Delegation[]> {
    const url = `${this.restEndpoint}/${chainName}/cosmos/staking/v1beta1/delegations/${address}`
    this.logger.info(`Fetching delegations from ${url}`)
    const delegationsResponse = await this.httpClient.get(url)

    if (delegationsResponse.delegation_responses === undefined || delegationsResponse.delegation_responses.length === 0) {
      return []
    }

    return delegationsResponse.delegation_responses.map((delegation: any) => {
      const exponent = getExponentByDenom(delegation.balance.denom as string)

      return {
        validatorAddress: delegation.delegation.validator_address,
        amount: delegation.balance,
        displayAmount: shiftDigits(delegation.balance.amount as string, -exponent)
      }
    })
  };
}
