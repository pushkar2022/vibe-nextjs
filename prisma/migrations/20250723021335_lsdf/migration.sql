/*
  Warnings:

  - You are about to drop the column `createdAt` on the `Fragment` table. All the data in the column will be lost.
  - You are about to drop the column `updatedAt` on the `Fragment` table. All the data in the column will be lost.
  - You are about to drop the column `projectId` on the `Message` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "Message" DROP CONSTRAINT "Message_projectId_fkey";

-- AlterTable
ALTER TABLE "Fragment" DROP COLUMN "createdAt",
DROP COLUMN "updatedAt";

-- AlterTable
ALTER TABLE "Message" DROP COLUMN "projectId";
