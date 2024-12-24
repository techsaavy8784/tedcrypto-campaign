import type Campaign from '../Campaign/Campaign'

export interface GrantRedelegateClient {
  execRedelegateGrant: (campaign: Campaign, granteeWalletMnemonic: string, granterWalletAddress: string) => Promise<void>
}
