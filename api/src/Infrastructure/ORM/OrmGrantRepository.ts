import { PrismaClient } from '@prisma/client'
import { inject, injectable } from 'inversify'
import Grant from '../../Domain/Grant/Grant'
import { GrantId } from '../../Domain/Grant/GrantId'
import { GrantRepository } from '../../Domain/Grant/GrantRepository'
import { TYPES } from '../DependencyInjection/types'
import RecordNotFound from '../../Domain/RecordNotFound'

@injectable()
export default class OrmGrantRepository implements GrantRepository {
  constructor (
    @inject(TYPES.PrismaClient) private readonly prismaClient: PrismaClient
  ) {
  }

  async findByWallet (wallet: string): Promise<Grant | null> {
    const object = await this.prismaClient.grant.findFirst({
      where: { wallet }
    })

    if (object === null) {
      return null
    }

    return Grant.fromObject(object)
  }

  async save (grant: Grant): Promise<void> {
    await this.prismaClient.grant.upsert({
      where: { id: grant.id.toString() },
      update: grant.toObject(),
      create: grant.toObject()
    })
  }

  async get (id: GrantId): Promise<Grant> {
    const object = await this.prismaClient.grant.findUnique({
      where: { id: id.toString() }
    })

    if (object === null) {
      throw new RecordNotFound(`Grant with "${id.toString()}" id not found`)
    }

    return Grant.fromObject(object)
  }

  async delete (id: GrantId): Promise<void> {
    await this.prismaClient.grant.delete({
      where: { id: id.toString() }
    })
  }
}
