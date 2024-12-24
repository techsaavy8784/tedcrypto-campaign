import { CampaignId } from './CampaignId'

export interface CampaignArray {
  id: string
  chainName: string
  name: string
  targetAmount: string
  currentAmount: string
  validator: string
  validatorName: string
  validatorImage: string
  campaignWalletAddress: string
  createdAt: Date
  updatedAt: Date
}

export default class Campaign {
  constructor (
    public id: CampaignId,
    public chainName: string,
    public name: string,
    public targetAmount: string,
    public currentAmount: string,
    public validator: string,
    public validatorName: string,
    public validatorImage: string,
    public campaignWalletAddress: string,
    public createdAt: Date,
    public updatedAt: Date
  ) {}

  public static fromObject (object: CampaignArray): Campaign {
    return new Campaign(
      CampaignId.fromString(object.id),
      object.chainName,
      object.name,
      object.targetAmount,
      object.currentAmount,
      object.validator,
      object.validatorName,
      object.validatorImage,
      object.campaignWalletAddress,
      new Date(object.createdAt),
      new Date(object.updatedAt)
    )
  }

  public toObject (): CampaignArray {
    return {
      id: this.id.toString(),
      chainName: this.chainName,
      name: this.name,
      targetAmount: this.targetAmount,
      currentAmount: this.currentAmount,
      validator: this.validator,
      validatorName: this.validatorName,
      validatorImage: this.validatorImage,
      campaignWalletAddress: this.campaignWalletAddress,
      createdAt: this.createdAt,
      updatedAt: this.updatedAt
    }
  }
}
