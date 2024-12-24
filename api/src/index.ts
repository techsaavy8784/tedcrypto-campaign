import { server } from './Infrastructure/Http/Server'
import { myContainer } from './Infrastructure/DependencyInjection/inversify.config'
import { TYPES } from './Infrastructure/DependencyInjection/types'
import type Logger from './Application/Logger/Logger'

const logger = myContainer.get<Logger>(TYPES.Logger)

server.listen(process.env.PORT, () => {
  logger.info(`[server]: Server is running at http://localhost:${process.env.PORT}`)
})
