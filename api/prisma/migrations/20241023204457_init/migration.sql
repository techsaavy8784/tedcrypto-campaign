-- CreateTable
CREATE TABLE `Grant` (
    `id` VARCHAR(191) NOT NULL,
    `wallet` VARCHAR(191) NOT NULL,
    `tokens` VARCHAR(191) NOT NULL,
    `txHash` VARCHAR(191) NOT NULL,
    `ip` VARCHAR(191) NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Campaign` (
    `id` VARCHAR(191) NOT NULL,
    `chainName` VARCHAR(191) NOT NULL,
    `name` VARCHAR(191) NOT NULL,
    `targetAmount` VARCHAR(191) NOT NULL,
    `currentAmount` VARCHAR(191) NOT NULL,
    `validator` VARCHAR(191) NOT NULL,
    `validatorName` VARCHAR(191) NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
