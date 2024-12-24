import type Command from '../../../Domain/Command/Command'
import { type GrantId } from '../../../Domain/Grant/GrantId'

export default class CreateGrant implements Command {
  constructor (
    public readonly id: GrantId,
    public readonly wallet: string,
    public readonly tokens: string,
    public readonly txHash: string,
    public readonly ip: string
  ) {}
}
