const TYPES = {
  // Generics
  CommandHandler: Symbol.for('CommandHandler'),
  EventHandler: Symbol.for('EventHandler'),
  Logger: Symbol.for('Logger'),

  // Security

  // Factories

  // Repositories
  GrantRepository: Symbol.for('GrantRepository'),
  CampaignRepository: Symbol.for('CampaignRepository'),

  // Clients
  HttpClient: Symbol.for('HttpClient'),
  PrismaClient: Symbol.for('PrismaClient'),
  OracleClient: Symbol.for('OracleClient'),

  // Services
  GrantRedelegateClient: Symbol.for('GrantRedelegateClient')
}

export { TYPES }
