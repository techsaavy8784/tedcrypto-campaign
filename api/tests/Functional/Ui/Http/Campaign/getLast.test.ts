import DatabaseUtil from "../../../../Helper/DatabaseUtil";
import {PrismaClient} from "@prisma/client";
import {myContainer} from "../../../../../src/Infrastructure/DependencyInjection/inversify.config";
import {TYPES} from "../../../../../src/Infrastructure/DependencyInjection/types";
import { v7 as uuidv7 } from 'uuid';
import SuperTestRequestBuilder from "../../../../Helper/SuperTestRequestBuilder";
import {createCampaign} from "../../../../Helper/StaticFixtures";

const prismaClient: PrismaClient = myContainer.get(TYPES.PrismaClient);

describe('GET /api/campaign/last', () => {
    beforeEach(async () => {
        await DatabaseUtil.truncateAllTables(prismaClient)
    })

    it('should return 404 if campaign not found', async () => {
        const response = await SuperTestRequestBuilder
            .get('/api/campaign/last')
            .build();

        expect(response.status).toBe(404);
    });

    it('should return 200 and the campaign if found', async () => {
        const campaign = await createCampaign();

        const response = await SuperTestRequestBuilder
            .get('/api/campaign/last')
            .build();

        expect(response.status).toBe(200);
        expect(response.body.name).toEqual(campaign.toObject().name);
        expect(response.body.targetAmount).toEqual(campaign.toObject().targetAmount);
    })
});