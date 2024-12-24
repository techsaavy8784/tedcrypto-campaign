import { ConsoleCommand } from '../../Domain/Console/ConsoleCommand'
import { inject, injectable } from 'inversify'
import CommandHandlerManager from '../../Infrastructure/CommandHandler/CommandHandlerManager'
import { CampaignId } from '../../Domain/Campaign/CampaignId'
import Redelegate from '../../Application/Cosmos/Redelegate/Redelegate'
import { TYPES } from '../../Infrastructure/DependencyInjection/types'
import { CampaignRepository } from '../../Domain/Campaign/CampaignRepository'
import { isEmpty } from '../../Application/Shared/StringTools'

@injectable()
export default class RedelegateGrants implements ConsoleCommand {
  public static commandName = 'campaign:redelegate-grants'

  constructor (
    @inject(CommandHandlerManager) private readonly commandHandlerManager: CommandHandlerManager,
    @inject(TYPES.CampaignRepository) private readonly campaignRepository: CampaignRepository
  ) {
  }

  configureArgs (inputArgs: any): void {
  }

  public async run (inputArgs: any): Promise<number> {
    const campaignId = inputArgs[0] as string
    const wallet = inputArgs[1] as string
    const mnemonic = inputArgs[2] as string

    if (isEmpty(wallet) || isEmpty(mnemonic)) {
      console.error('Missing required arguments. Usage: campaign:redelegate-grants <campaignId> <wallet> <mnemonic>')
      return 1
    }

    await this.commandHandlerManager.handle(
      new Redelegate(
        await this.campaignRepository.get(CampaignId.fromString(campaignId)),
        wallet,
        mnemonic
      )
    )

    return 0
  }
}
