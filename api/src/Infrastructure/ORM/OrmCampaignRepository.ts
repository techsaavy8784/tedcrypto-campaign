import { PrismaClient } from '@prisma/client'
import { inject, injectable } from 'inversify'
import Campaign from '../../Domain/Campaign/Campaign'
import { CampaignId } from '../../Domain/Campaign/CampaignId'
import { TYPES } from '../DependencyInjection/types'
import RecordNotFound from '../../Domain/RecordNotFound'
import { CampaignRepository } from '../../Domain/Campaign/CampaignRepository'

@injectable()
export default class OrmCampaignRepository implements CampaignRepository {
  constructor (
    @inject(TYPES.PrismaClient) private readonly prismaClient: PrismaClient
  ) {
  }

  async save (campaign: Campaign): Promise<void> {
    await this.prismaClient.campaign.upsert({
      where: { id: campaign.id.toString() },
      update: campaign.toObject(),
      create: campaign.toObject()
    })
  }

  async get (id: CampaignId): Promise<Campaign> {
    const object = await this.prismaClient.campaign.findUnique({
      where: { id: id.toString() }
    })

    if (object === null) {
      throw new RecordNotFound(`Campaign with "${id.toString()}" id not found`)
    }

    return Campaign.fromObject(object)
  }

  async getLast (): Promise<Campaign> {
    const object = await this.prismaClient.campaign.findFirst({
      orderBy: {
        createdAt: 'desc'
      }
    })

    if (object === null) {
      throw new RecordNotFound('No campaign found')
    }

    return Campaign.fromObject(object)
  }
}
