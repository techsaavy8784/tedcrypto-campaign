import CommandHandler from '../../../Domain/Command/CommandHandler'
import Redelegate from './Redelegate'
import { inject, injectable } from 'inversify'
import { GrantRedelegateClient } from '../../../Domain/Grant/GrantRedelegateClient'
import { TYPES } from '../../../Infrastructure/DependencyInjection/types'

@injectable()
export default class RedelegateHandler implements CommandHandler<Redelegate> {
  constructor (
    @inject(TYPES.GrantRedelegateClient) private readonly grantRedelegateClient: GrantRedelegateClient
  ) {
  }

  async handle (command: Redelegate): Promise<void> {
    await this.grantRedelegateClient.execRedelegateGrant(command.campaign, command.granteeMnemonic, command.walletAddress)
  }
}
