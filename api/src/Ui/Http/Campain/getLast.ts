import { type Request, type Response } from 'express'
import { handleCommand } from '../handleCommandUtil'
import type Campaign from '../../../Domain/Campaign/Campaign'
import GetLastCampaign from '../../../Application/Query/GetLastCampaign/GetLastCampaign'

export const getLast = async (req: Request, resp: Response): Promise<void> => {
  await handleCommand(
    new GetLastCampaign(),
    resp,
    (campaign: Campaign) => {
      resp.status(200).send(campaign.toObject())
    }
  )
}
