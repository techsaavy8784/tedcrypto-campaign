import { Router, type Response, type Request, type NextFunction } from 'express'
import { getCampaign } from '../../../Ui/Http/Campain/getCampaign'
import { getLast } from '../../../Ui/Http/Campain/getLast'

const CampaignRouter = Router()

CampaignRouter.get('/last', (req: Request, resp: Response, next: NextFunction) => {
  getLast(req, resp).then(next).catch(next)
})

CampaignRouter.get('/:id([0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12})', (req: Request, resp: Response, next: NextFunction) => {
  getCampaign(req, resp).then(next).catch(next)
})

export default CampaignRouter
