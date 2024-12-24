import type Command from '../../../Domain/Command/Command'
import { type CampaignId } from '../../../Domain/Campaign/CampaignId'

export class UpdateGrants implements Command {
  constructor (
    public readonly campaignId: CampaignId
  ) {
  }
}
