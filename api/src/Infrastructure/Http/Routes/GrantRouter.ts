import { Router, type Response, type Request, type NextFunction } from 'express'
import { createGrant } from '../../../Ui/Http/Grant/createGrant'
import { revokeGrant } from '../../../Ui/Http/Grant/revokeGrant'

const CampaignRouter = Router()

CampaignRouter.post('', (req: Request, resp: Response, next: NextFunction) => {
  createGrant(req, resp).then(next).catch(next)
})

CampaignRouter.delete('/:id([0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12})', (req: Request, resp: Response, next: NextFunction) => {
  revokeGrant(req, resp).then(next).catch(next)
})

export default CampaignRouter
