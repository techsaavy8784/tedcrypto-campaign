import { type Request, type Response } from 'express'
import { handleCommand } from '../handleCommandUtil'
import CreateGrant from '../../../Application/Write/CreateGrant/CreateGrant'
import { GrantId } from '../../../Domain/Grant/GrantId'
import { UpdateGrants } from '../../../Application/Write/UpdateGrants/UpdateGrants'
import { CampaignId } from '../../../Domain/Campaign/CampaignId'
import { myContainer } from '../../../Infrastructure/DependencyInjection/inversify.config'
import CommandHandlerManager from '../../../Infrastructure/CommandHandler/CommandHandlerManager'
import { TYPES } from '../../../Infrastructure/DependencyInjection/types'
import type Logger from '../../../Application/Logger/Logger'

export const createGrant = async (req: Request, resp: Response): Promise<void> => {
  const requiredFields = ['campaignId', 'wallet', 'tokens', 'txHash']
  const missingFields = requiredFields.filter((field) => !(field in req.body))
  if (missingFields.length > 0) {
    resp.status(400).send(`Missing fields: ${missingFields.join(', ')}`)
    return
  }

  try {
    const commandHandler = myContainer.get<CommandHandlerManager>(CommandHandlerManager)
    await commandHandler.handle(new UpdateGrants(CampaignId.fromString(req.body.campaignId as string)))
  } catch (error) {
    myContainer.get<Logger>(TYPES.Logger).error('Error updating grants', { error })
  }

  await handleCommand(
    new CreateGrant(
      GrantId.generate(),
      req.body.wallet as string,
      req.body.tokens as string,
      req.body.txHash as string,
      req.ip ?? ''
    ),
    resp,
    () => {
      resp.status(201).send()
    }
  )
}
