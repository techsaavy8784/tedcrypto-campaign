import { ConsoleCommand } from '../../Domain/Console/ConsoleCommand'
import { inject, injectable } from 'inversify'
import CommandHandlerManager from '../../Infrastructure/CommandHandler/CommandHandlerManager'
import { CampaignId } from '../../Domain/Campaign/CampaignId'
import { UpdateGrants as UpdateGrantsCommand } from '../../Application/Write/UpdateGrants/UpdateGrants'

@injectable()
export default class UpdateGrants implements ConsoleCommand {
  public static commandName = 'campaign:update-grants'

  constructor (
    @inject(CommandHandlerManager) private readonly commandHandlerManager: CommandHandlerManager
  ) {
  }

  configureArgs (inputArgs: any): void {
  }

  public async run (inputArgs: any): Promise<number> {
    const campaignId = inputArgs[0]

    await this.commandHandlerManager.handle(
      new UpdateGrantsCommand(CampaignId.fromString(String(campaignId)))
    )

    return 0
  }
}
