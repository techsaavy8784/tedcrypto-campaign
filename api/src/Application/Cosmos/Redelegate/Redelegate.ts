import type Command from '../../../Domain/Command/Command'
import type Campaign from '../../../Domain/Campaign/Campaign'

export default class Redelegate implements Command {
  constructor (
    public readonly campaign: Campaign,
    public readonly walletAddress: string,
    public readonly granteeMnemonic: string
  ) {}
}
