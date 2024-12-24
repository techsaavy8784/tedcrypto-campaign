import type Grant from './Grant'
import { type GrantId } from './GrantId'

export interface GrantRepository {
  findByWallet: (wallet: string) => Promise<Grant | null>

  save: (grant: Grant) => Promise<void>

  /**
     * @throws RecordNotFound
     */
  get: (id: GrantId) => Promise<Grant>

  delete: (id: GrantId) => Promise<void>
}
