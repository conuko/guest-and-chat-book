/*
  Warnings:

  - You are about to drop the column `guestbookId` on the `Like` table. All the data in the column will be lost.
  - You are about to drop the `Guestbook` table. If the table is not empty, all the data it contains will be lost.
  - A unique constraint covering the columns `[postId,userId]` on the table `Like` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `postId` to the `Like` table without a default value. This is not possible if the table is not empty.

*/
-- DropIndex
DROP INDEX `Like_guestbookId_idx` ON `Like`;

-- DropIndex
DROP INDEX `Like_guestbookId_userId_key` ON `Like`;

-- AlterTable
ALTER TABLE `Like` DROP COLUMN `guestbookId`,
    ADD COLUMN `postId` VARCHAR(191) NOT NULL;

-- DropTable
DROP TABLE `Guestbook`;

-- CreateTable
CREATE TABLE `Post` (
    `id` VARCHAR(191) NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,
    `name` VARCHAR(191) NOT NULL,
    `message` VARCHAR(100) NOT NULL,
    `userId` VARCHAR(191) NOT NULL,

    INDEX `Post_userId_idx`(`userId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateIndex
CREATE INDEX `Like_postId_idx` ON `Like`(`postId`);

-- CreateIndex
CREATE UNIQUE INDEX `Like_postId_userId_key` ON `Like`(`postId`, `userId`);
