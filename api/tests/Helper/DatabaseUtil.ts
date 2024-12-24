import {PrismaClient} from "@prisma/client";
import {myContainer} from "../../src/Infrastructure/DependencyInjection/inversify.config";
import {TYPES} from "../../src/Infrastructure/DependencyInjection/types";

export default class DatabaseUtil {
    public static async truncateAllTables(prismaClient?: PrismaClient) {
        prismaClient = prismaClient ?? myContainer.get<PrismaClient>(TYPES.PrismaClient)

        await prismaClient.$executeRaw`SET FOREIGN_KEY_CHECKS=0`;
        await prismaClient.$executeRaw`TRUNCATE TABLE Campaign`;
        await prismaClient.$executeRaw`TRUNCATE TABLE \`Grant\``;
        await prismaClient.$executeRaw`SET FOREIGN_KEY_CHECKS=1`;
    }
}