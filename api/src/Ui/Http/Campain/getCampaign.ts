import { type Request, type Response } from 'express'
import { handleCommand } from '../handleCommandUtil'
import type Campaign from '../../../Domain/Campaign/Campaign'
import { CampaignId } from '../../../Domain/Campaign/CampaignId'
import GetCampaign from '../../../Application/Query/GetCampaign/GetCampaign'

export const getCampaign = async (req: Request, resp: Response): Promise<void> => {
  await handleCommand(
    new GetCampaign(CampaignId.fromString(req.params.id)),
    resp,
    (campaign: Campaign) => {
      resp.status(200).send(campaign.toObject())
    }
  )
}
