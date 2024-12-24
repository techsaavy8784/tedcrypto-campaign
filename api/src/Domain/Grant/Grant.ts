import { GrantId } from './GrantId'

export interface GrantArray {
  id: string
  wallet: string
  tokens: string
  txHash: string
  ip: string
  isValid: boolean | null
  createdAt?: Date | undefined
}

export default class Grant {
  constructor (
    public id: GrantId,
    public wallet: string,
    public tokens: string,
    public txHash: string,
    public ip: string,
    public isValid: boolean | null,
    public createdAt: Date
  ) {}

  public static fromObject (object: GrantArray): Grant {
    return new Grant(
      GrantId.fromString(object.id),
      object.wallet,
      object.tokens,
      object.txHash,
      object.ip,
      object.isValid,
      new Date(object.createdAt ?? '')
    )
  }

  public toObject (): GrantArray {
    return {
      id: this.id.toString(),
      wallet: this.wallet,
      tokens: this.tokens,
      txHash: this.txHash,
      ip: this.ip,
      isValid: this.isValid,
      createdAt: this.createdAt
    }
  }
}
