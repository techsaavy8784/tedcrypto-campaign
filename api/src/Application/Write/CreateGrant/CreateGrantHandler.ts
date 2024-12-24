import CommandHandler from '../../../Domain/Command/CommandHandler'
import CreateGrant from './CreateGrant'
import { inject, injectable } from 'inversify'
import { TYPES } from '../../../Infrastructure/DependencyInjection/types'
import { GrantRepository } from '../../../Domain/Grant/GrantRepository'
import Grant from '../../../Domain/Grant/Grant'

@injectable()
export default class CreateGrantHandler implements CommandHandler<CreateGrant> {
  constructor (
    @inject(TYPES.GrantRepository) private readonly repository: GrantRepository
  ) {}

  async handle (command: CreateGrant): Promise<void> {
    const grant = await this.repository.findByWallet(command.wallet)
    if (grant !== null) {
      await this.repository.delete(grant.id)
    }

    await this.repository.save(new Grant(
      command.id,
      command.wallet,
      command.tokens,
      command.txHash,
      command.ip,
      null,
      new Date()
    ))
  }
}
