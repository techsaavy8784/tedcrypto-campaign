import type Command from '../../../Domain/Command/Command'
import { type CampaignId } from '../../../Domain/Campaign/CampaignId'

export default class GetCampaign implements Command {
  constructor (
    public id: CampaignId
  ) {}
}
