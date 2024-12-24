import type Campaign from './Campaign'
import { type CampaignId } from './CampaignId'

export interface CampaignRepository {
  save: (campaign: Campaign) => Promise<void>

  /**
     * @throws RecordNotFound
     */
  get: (campaign: CampaignId) => Promise<Campaign>

  /**
     * @throws RecordNotFound
     */
  getLast: () => Promise<Campaign>
}
