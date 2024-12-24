import CommandHandler from '../../../Domain/Command/CommandHandler'
import { inject, injectable } from 'inversify'
import { TYPES } from '../../../Infrastructure/DependencyInjection/types'
import { CampaignRepository } from '../../../Domain/Campaign/CampaignRepository'
import Campaign from '../../../Domain/Campaign/Campaign'
import GetLastCampaign from './GetLastCampaign'

@injectable()
export default class GetLastCampaignHandler implements CommandHandler<GetLastCampaign> {
  constructor (
    @inject(TYPES.CampaignRepository) private readonly campaignRepository: CampaignRepository
  ) {
  }

  async handle (command: GetLastCampaign): Promise<Campaign> {
    return await this.campaignRepository.getLast()
  }
}
