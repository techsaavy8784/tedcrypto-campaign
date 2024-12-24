import Campaign from "../../src/Domain/Campaign/Campaign";
import {myContainer} from "../../src/Infrastructure/DependencyInjection/inversify.config";
import {TYPES} from "../../src/Infrastructure/DependencyInjection/types";
import {CampaignId} from "../../src/Domain/Campaign/CampaignId";
import {CampaignRepository} from "../../src/Domain/Campaign/CampaignRepository";
import Grant from "../../src/Domain/Grant/Grant";
import {GrantId} from "../../src/Domain/Grant/GrantId";
import {GrantRepository} from "../../src/Domain/Grant/GrantRepository";

export const createCampaign = async (): Promise<Campaign> => {
    const campaign = new Campaign(
        CampaignId.generate(),
        "cosmoshub",
        "Cosmos Hub",
        '100000',
        '10000',
        "cosmosvaloper16n2587cgz46nn5d0c5mcqlsnx8pvg566gt2a2p",
        "Tedcrypto.io",
        "https://s3.amazonaws.com/keybase_processed_uploads/84110931964a58bc811be5b8e19e7605_360_360.jpg",
        "cosmosvaloper16n2587cgz46nn5d0c5mcqlsnx8pvg566gt2a2p",
        new Date(),
        new Date()
    );

    await myContainer.get<CampaignRepository>(TYPES.CampaignRepository).save(campaign)

    return campaign;
}

export const createGrant = async (): Promise<Grant> => {
    const grant = new Grant(
        GrantId.generate(),
        'test-wallet',
        '1000',
        'test-tx-hash',
        '1.1.1.0',
        false,
        new Date(),
    )

    await myContainer.get<GrantRepository>(TYPES.GrantRepository).save(grant)

    return grant;
}