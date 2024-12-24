import { type Request, type Response } from 'express'
import { handleCommand } from '../handleCommandUtil'
import { GrantId } from '../../../Domain/Grant/GrantId'
import RevokeGrant from '../../../Application/Write/RevokeGrant/RevokeGrant'
import { myContainer } from '../../../Infrastructure/DependencyInjection/inversify.config'
import CommandHandlerManager from '../../../Infrastructure/CommandHandler/CommandHandlerManager'
import { UpdateGrants } from '../../../Application/Write/UpdateGrants/UpdateGrants'
import { CampaignId } from '../../../Domain/Campaign/CampaignId'
import type Logger from '../../../Application/Logger/Logger'
import { TYPES } from '../../../Infrastructure/DependencyInjection/types'

export const revokeGrant = async (req: Request, resp: Response): Promise<void> => {
  try {
    const commandHandler = myContainer.get<CommandHandlerManager>(CommandHandlerManager)
    await commandHandler.handle(new UpdateGrants(CampaignId.fromString(req.body.campaignId as string)))
  } catch (error) {
    myContainer.get<Logger>(TYPES.Logger).error('Error updating grants', { error })
  }

  await handleCommand(
    new RevokeGrant(GrantId.fromString(req.params.id)),
    resp,
    () => {
      resp.status(200).send()
    }
  )
}
