/*
  Warnings:

  - Added the required column `validatorImage` to the `Campaign` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `Campaign` ADD COLUMN `validatorImage` VARCHAR(191) NOT NULL;

-- AlterTable
ALTER TABLE `Grant` ADD COLUMN `isValid` BOOLEAN NULL;
