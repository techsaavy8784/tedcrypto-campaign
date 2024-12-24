import { inject, injectable } from 'inversify'
import { TYPES } from '../../../Infrastructure/DependencyInjection/types'
import { HttpClient } from '../../../Domain/Http/HttpClient'
import { UpdateGrants } from './UpdateGrants'
import CommandHandler from '../../../Domain/Command/CommandHandler'
import { CampaignRepository } from '../../../Domain/Campaign/CampaignRepository'
import Logger from '../../Logger/Logger'

@injectable()
export default class UpdateGrantsHandler implements CommandHandler<UpdateGrants> {
  constructor (
    @inject(TYPES.HttpClient) private readonly httpClient: HttpClient,
    @inject(TYPES.CampaignRepository) private readonly campaignRepository: CampaignRepository,
    @inject(TYPES.Logger) private readonly logger: Logger
  ) {}

  public async handle (command: UpdateGrants): Promise<any> {
    const campaign = await this.campaignRepository.get(command.campaignId)
    try {
      const url = `https://rest.cosmos.directory/cosmoshub/cosmos/authz/v1beta1/grants/grantee/${campaign.campaignWalletAddress}`
      this.logger.info(`Fetching grants for campaign ${campaign.id.toString()} from ${url}`)
      const response = await this.httpClient.get(url)
      const grants: any = response.grants ?? []

      this.logger.info(`Found ${grants.length} grants for campaign ${campaign.id.toString()}`)

      // Calculate the total amount of tokens based on max_tokens for each grant
      let totalTokens = 0
      grants.forEach((grant: any) => {
        if (grant.authorization?.max_tokens?.amount !== undefined) {
          totalTokens += grant.authorization.max_tokens.amount / 1000000
        }
      })

      this.logger.info(`Total tokens for campaign ${campaign.id.toString()}: ${totalTokens}`)

      // Update the campaign's current amount with the calculated total tokens
      campaign.currentAmount = totalTokens.toString()

      // Save the updated campaign
      await this.campaignRepository.save(campaign)

      return { success: true }
    } catch (error: any) {
      this.logger.error('Error updating grants:', { error })
      throw new Error(`Failed to update grants: ${error.message}`)
    }
  }
}
