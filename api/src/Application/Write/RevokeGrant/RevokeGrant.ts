import type Command from '../../../Domain/Command/Command'
import { type GrantId } from '../../../Domain/Grant/GrantId'

export default class RevokeGrant implements Command {
  constructor (
    public readonly id: GrantId
  ) {}
}
