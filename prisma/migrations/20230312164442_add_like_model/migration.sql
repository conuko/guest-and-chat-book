/*
  Warnings:

  - Added the required column `updatedAt` to the `Guestbook` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `Guestbook` ADD COLUMN `updatedAt` DATETIME(3) NOT NULL;

-- CreateTable
CREATE TABLE `Like` (
    `id` VARCHAR(191) NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,
    `guestbookId` VARCHAR(191) NOT NULL,
    `userId` VARCHAR(191) NOT NULL,

    INDEX `Like_guestbookId_idx`(`guestbookId`),
    INDEX `Like_userId_idx`(`userId`),
    UNIQUE INDEX `Like_guestbookId_userId_key`(`guestbookId`, `userId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
