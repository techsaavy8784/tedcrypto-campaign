import { PrismaClient } from '@prisma/client'
import { v7 as uuidv7 } from 'uuid'

const prisma = new PrismaClient()

async function main (): Promise<void> {
  // Seed Campaign data
  const campaignId = uuidv7()
  await prisma.campaign.create({
    data: {
      id: campaignId,
      chainName: 'cosmoshub',
      name: 'Tedlotto in cosmos',
      targetAmount: '1000000',
      currentAmount: '500000',
      validator: 'cosmosvaloper16n2587cgz46nn5d0c5mcqlsnx8pvg566gt2a2p',
      validatorName: 'Tedcrypto.io',
      validatorImage: 'https://s3.amazonaws.com/keybase_processed_uploads/84110931964a58bc811be5b8e19e7605_360_360.jpg',
      campaignWalletAddress: 'cosmos16n2587cgz46nn5d0c5mcqlsnx8pvg566dl7gxj',
      createdAt: new Date()
    }
  })

  // Seed Grant data
  const grantId = uuidv7()
  await prisma.grant.create({
    data: {
      id: grantId,
      wallet: 'cosmos16n2587cgz46nn5d0c5mcqlsnx8pvg566dl7gxj',
      tokens: '10000000',
      txHash: 'ABCD1234EFGH5678',
      ip: '192.168.1.1',
      isValid: true,
      createdAt: new Date()
    }
  })
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally((): void => {
    prisma.$disconnect().catch((e) => {
      console.error(e)
    })
  })
