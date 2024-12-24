import express, { type Request, type Response, type NextFunction } from 'express'
import dotenv from 'dotenv'
import cors from 'cors'
import { myContainer } from '../DependencyInjection/inversify.config'
import { TYPES } from '../DependencyInjection/types'
import type Logger from '../../Application/Logger/Logger'
import CampaignRouter from './Routes/CampaignRouter'
import GrantRouter from './Routes/GrantRouter'

dotenv.config({ override: false })

const logger = myContainer.get<Logger>(TYPES.Logger)

const app = express()
const corsOptions = {
  origin: process.env.CORS_ORIGIN
}

// Setting it up
app.use(cors(corsOptions))
app.set('trust proxy', true)
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

app.get('/', (req: any, res: any) => {
  res.send(`Hello ${req.ip} there!`)
})

app.use('/api/campaign', CampaignRouter)
app.use('/api/grant', GrantRouter)

app.use((req: Request, res: Response, next: NextFunction) => {
  if (res.headersSent) {
    return
  }

  logger.info('Not found', {
    req: {
      url: req.url,
      method: req.method,
      headers: req.headers
    }
  })
  res.status(404).json({ message: 'Not found' })
})

app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
  logger.error('Server returned an error', {
    error: {
      message: err.message,
      stack: err.stack
    },
    req: {
      url: req.url,
      method: req.method,
      headers: req.headers
    },
    res: {
      headers: res.getHeaders(),
      statusCode: res.statusCode,
      statusMessage: res.statusMessage
    },
    err
  })
  res.status(500).json({ message: err.message })
})

export const server = app
