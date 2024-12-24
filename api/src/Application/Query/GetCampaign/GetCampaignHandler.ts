import CommandHandler from '../../../Domain/Command/CommandHandler'
import GetCampaign from './GetCampaign'
import { inject, injectable } from 'inversify'
import { TYPES } from '../../../Infrastructure/DependencyInjection/types'
import { CampaignRepository } from '../../../Domain/Campaign/CampaignRepository'
import Campaign from '../../../Domain/Campaign/Campaign'

@injectable()
export default class GetCampaignHandler implements CommandHandler<GetCampaign> {
  constructor (
    @inject(TYPES.CampaignRepository) private readonly campaignRepository: CampaignRepository
  ) {
  }

  async handle (command: GetCampaign): Promise<Campaign> {
    return await this.campaignRepository.get(command.id)
  }
}
