/*
  Warnings:

  - Added the required column `campaignWalletAddress` to the `Campaign` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `Campaign` ADD COLUMN `campaignWalletAddress` VARCHAR(191) NOT NULL;
