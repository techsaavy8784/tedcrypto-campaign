import 'reflect-metadata'
import { Container } from 'inversify'
import CommandHandlerManager from '../CommandHandler/CommandHandlerManager'
import { TYPES } from './types'
import { PrismaClient } from '@prisma/client'
import EventDispatcher from '../../Application/Event/EventDispatcher/EventDispatcher'
import AxiosHttpClient from '../Http/AxiosHttpClient'
import RetryAxiosHttpClient from '../Http/RetryAxiosHttpClient'
import { type HttpClient } from '../../Domain/Http/HttpClient'
import ConsoleLogProvider from '../Logger/ConsoleLogProvider'
import LoggerManager from '../../Application/Logger/LoggerManager'
import LokiLogProvider from '../Logger/LokiLogProvider'
import type Logger from '../../Application/Logger/Logger'
import { isEmpty } from '../../Application/Shared/StringTools'
import { type GrantRepository } from '../../Domain/Grant/GrantRepository'
import OrmGrantRepository from '../ORM/OrmGrantRepository'
import GetCampaignHandler from '../../Application/Query/GetCampaign/GetCampaignHandler'
import { type CampaignRepository } from '../../Domain/Campaign/CampaignRepository'
import OrmCampaignRepository from '../ORM/OrmCampaignRepository'
import GetLastCampaignHandler from '../../Application/Query/GetLastCampaign/GetLastCampaignHandler'
import UpdateGrantsHandler from '../../Application/Write/UpdateGrants/UpdateGrantsHandler'
import UpdateGrants from '../../Ui/Console/UpdateGrants'
import CreateGrantHandler from '../../Application/Write/CreateGrant/CreateGrantHandler'
import RevokeGrantHandler from '../../Application/Write/RevokeGrant/RevokeGrantHandler'
import RedelegateHandler from '../../Application/Cosmos/Redelegate/RedelegateHandler'
import { CosmosAuthzClient } from '../Cosmos/CosmosAuthzClient'
import RedelegateGrants from '../../Ui/Console/RedelegateGrants'

const myContainer = new Container()

// Logger
myContainer.bind(ConsoleLogProvider).toSelf()

const loggerManager = new LoggerManager()
loggerManager.addProvider(myContainer.get(ConsoleLogProvider))
if (!isEmpty(process.env.LOKI_HOST)) {
  loggerManager.addProvider(new LokiLogProvider(
    String(process.env.LOKI_HOST),
    isEmpty(process.env.LOKI_AUTH) ? undefined : String(process.env.LOKI_AUTH)
  ))
}
myContainer.bind<Logger>(TYPES.Logger).toConstantValue(loggerManager.createLogger({}))

// Repositories
myContainer.bind<PrismaClient>(TYPES.PrismaClient).toConstantValue(new PrismaClient())
myContainer.bind<GrantRepository>(TYPES.GrantRepository).to(OrmGrantRepository)
myContainer.bind<CampaignRepository>(TYPES.CampaignRepository).to(OrmCampaignRepository)

// Command handlers
myContainer.bind(TYPES.CommandHandler).to(GetCampaignHandler)
myContainer.bind(TYPES.CommandHandler).to(GetLastCampaignHandler)
myContainer.bind(TYPES.CommandHandler).to(UpdateGrantsHandler)
myContainer.bind(TYPES.CommandHandler).to(CreateGrantHandler)
myContainer.bind(TYPES.CommandHandler).to(RevokeGrantHandler)
myContainer.bind(TYPES.CommandHandler).to(RedelegateHandler)
myContainer.bind<CommandHandlerManager>(CommandHandlerManager).toSelf()

// Events
myContainer.bind<EventDispatcher>(EventDispatcher).toSelf()

// Factories

// Security

// Services
myContainer.bind(AxiosHttpClient).toSelf()
myContainer.bind(RetryAxiosHttpClient).toSelf()
myContainer.bind<HttpClient>(TYPES.HttpClient).to(RetryAxiosHttpClient)
myContainer.bind(TYPES.GrantRedelegateClient).to(CosmosAuthzClient)

// Console Command
myContainer.bind(UpdateGrants).toSelf()
myContainer.bind(RedelegateGrants).toSelf()

export { myContainer }
