import SuperTestRequestBuilder from "../../../../Helper/SuperTestRequestBuilder";
import DatabaseUtil from "../../../../Helper/DatabaseUtil";
import {myContainer} from "../../../../../src/Infrastructure/DependencyInjection/inversify.config";
import {TYPES} from "../../../../../src/Infrastructure/DependencyInjection/types";
import { PrismaClient } from "@prisma/client";
import {createGrant} from "../../../../Helper/StaticFixtures";
import {GrantRepository} from "../../../../../src/Domain/Grant/GrantRepository";
import {CampaignId} from "../../../../../src/Domain/Campaign/CampaignId";

describe('POST /api/grant', () => {
    const prismaClient = myContainer.get<PrismaClient>(TYPES.PrismaClient);
    const grantRepository = myContainer.get<GrantRepository>(TYPES.GrantRepository);

    beforeEach(async () => {
        await DatabaseUtil.truncateAllTables()
    })

    it('should create a grant successfully', async () => {
        const response = await SuperTestRequestBuilder
            .post('/api/grant', {
                wallet: 'test-wallet',
                tokens: '1000',
                txHash: 'test-tx-hash',
                campaignId: CampaignId.generate(),
            })
            .build();

        expect(response.status).toBe(201);
        const grant = await prismaClient.grant.findFirst({});
        expect(grant?.wallet).toBe('test-wallet');
        expect(grant?.tokens).toBe('1000');
        expect(grant?.txHash).toBe('test-tx-hash');
    });

    it('should create a new grant if granted again', async () => {
        const grant = await createGrant();
        await grantRepository.get(grant.id);

        const response = await SuperTestRequestBuilder
            .post('/api/grant', {
                wallet: 'test-wallet',
                tokens: '2000',
                txHash: 'updated-tx-hash',
                campaignId: CampaignId.generate(),
            })
            .build();

        expect(prismaClient.grant.findFirst({where: {id: grant.id.toString()}})).resolves.toBeNull();
        const newGrant = await prismaClient.grant.findFirst({where: {wallet: 'test-wallet'}});

        expect(newGrant?.id).not.toBe(grant.id);
        expect(newGrant?.wallet).toBe('test-wallet');
        expect(newGrant?.tokens).toBe('2000');
        expect(newGrant?.txHash).toBe('updated-tx-hash');
    });

    it('should return 400 if required fields are missing', async () => {
        const response = await SuperTestRequestBuilder
            .post('/api/grant', {
                wallet: 'test-wallet',
            })
            .build();

        expect(response.status).toBe(400);
        expect(response.text).toContain('Missing fields: campaignId, tokens, txHash');
    });
});