import CommandHandler from '../../../Domain/Command/CommandHandler'
import RevokeGrant from './RevokeGrant'
import { inject, injectable } from 'inversify'
import { TYPES } from '../../../Infrastructure/DependencyInjection/types'
import { GrantRepository } from '../../../Domain/Grant/GrantRepository'

@injectable()
export default class RevokeGrantHandler implements CommandHandler<RevokeGrant> {
  constructor (
    @inject(TYPES.GrantRepository) private readonly repository: GrantRepository
  ) {}

  async handle (command: RevokeGrant): Promise<void> {
    await this.repository.delete(command.id)
  }
}
