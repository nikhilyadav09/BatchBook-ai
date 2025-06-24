/*
  Warnings:

  - The values [DRAFT,PUBLISHED] on the enum `MemoryStatus` will be removed. If these variants are still used in the database, this will fail.
  - The values [NEW_MEMORY,NEW_COMMENT,NEW_REACTION,BATCH_INVITATION,MENTION,SYSTEM] on the enum `NotificationType` will be removed. If these variants are still used in the database, this will fail.
  - The values [LOVE] on the enum `ReactionType` will be removed. If these variants are still used in the database, this will fail.
  - You are about to drop the column `message` on the `batch_invitations` table. All the data in the column will be lost.
  - You are about to drop the column `status` on the `batch_invitations` table. All the data in the column will be lost.
  - You are about to drop the column `updatedAt` on the `batch_invitations` table. All the data in the column will be lost.
  - The `role` column on the `batch_members` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - You are about to drop the column `settings` on the `batches` table. All the data in the column will be lost.
  - You are about to drop the column `authorId` on the `comments` table. All the data in the column will be lost.
  - You are about to drop the column `isEdited` on the `comments` table. All the data in the column will be lost.
  - You are about to drop the column `parentId` on the `comments` table. All the data in the column will be lost.
  - You are about to drop the column `authorId` on the `memories` table. All the data in the column will be lost.
  - You are about to drop the column `metadata` on the `memories` table. All the data in the column will be lost.
  - You are about to drop the column `viewCount` on the `memories` table. All the data in the column will be lost.
  - The `category` column on the `memories` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - You are about to drop the column `data` on the `notifications` table. All the data in the column will be lost.
  - You are about to drop the column `achievements` on the `users` table. All the data in the column will be lost.
  - You are about to drop the column `isVerified` on the `users` table. All the data in the column will be lost.
  - You are about to drop the column `lastLoginAt` on the `users` table. All the data in the column will be lost.
  - You are about to drop the column `otpCode` on the `users` table. All the data in the column will be lost.
  - You are about to drop the column `otpExpiresAt` on the `users` table. All the data in the column will be lost.
  - You are about to drop the column `role` on the `users` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[token]` on the table `batch_invitations` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `expiresAt` to the `batch_invitations` table without a default value. This is not possible if the table is not empty.
  - Added the required column `token` to the `batch_invitations` table without a default value. This is not possible if the table is not empty.
  - Added the required column `createdById` to the `batches` table without a default value. This is not possible if the table is not empty.
  - Added the required column `userId` to the `comments` table without a default value. This is not possible if the table is not empty.
  - Added the required column `createdById` to the `memories` table without a default value. This is not possible if the table is not empty.
  - Added the required column `passwordHash` to the `users` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "Role" AS ENUM ('ADMIN', 'MODERATOR', 'MEMBER');

-- CreateEnum
CREATE TYPE "Category" AS ENUM ('GENERAL', 'ACADEMIC', 'SPORTS', 'CULTURAL', 'GRADUATION', 'REUNION', 'FAREWELL', 'FESTIVAL', 'TRIP', 'ACHIEVEMENT');

-- AlterEnum
BEGIN;
CREATE TYPE "MemoryStatus_new" AS ENUM ('ACTIVE', 'ARCHIVED', 'HIDDEN', 'FLAGGED');
ALTER TABLE "memories" ALTER COLUMN "status" DROP DEFAULT;
ALTER TABLE "memories" ALTER COLUMN "status" TYPE "MemoryStatus_new" USING ("status"::text::"MemoryStatus_new");
ALTER TYPE "MemoryStatus" RENAME TO "MemoryStatus_old";
ALTER TYPE "MemoryStatus_new" RENAME TO "MemoryStatus";
DROP TYPE "MemoryStatus_old";
ALTER TABLE "memories" ALTER COLUMN "status" SET DEFAULT 'ACTIVE';
COMMIT;

-- AlterEnum
BEGIN;
CREATE TYPE "NotificationType_new" AS ENUM ('MEMORY_LIKE', 'MEMORY_COMMENT', 'BATCH_INVITE', 'BATCH_JOIN', 'SYSTEM_UPDATE', 'MEMORY_MENTION');
ALTER TABLE "notifications" ALTER COLUMN "type" TYPE "NotificationType_new" USING ("type"::text::"NotificationType_new");
ALTER TYPE "NotificationType" RENAME TO "NotificationType_old";
ALTER TYPE "NotificationType_new" RENAME TO "NotificationType";
DROP TYPE "NotificationType_old";
COMMIT;

-- AlterEnum
BEGIN;
CREATE TYPE "ReactionType_new" AS ENUM ('LIKE', 'HEART', 'LAUGH', 'WOW', 'SAD', 'ANGRY');
ALTER TABLE "reactions" ALTER COLUMN "type" TYPE "ReactionType_new" USING ("type"::text::"ReactionType_new");
ALTER TYPE "ReactionType" RENAME TO "ReactionType_old";
ALTER TYPE "ReactionType_new" RENAME TO "ReactionType";
DROP TYPE "ReactionType_old";
COMMIT;

-- DropForeignKey
ALTER TABLE "comments" DROP CONSTRAINT "comments_authorId_fkey";

-- DropForeignKey
ALTER TABLE "comments" DROP CONSTRAINT "comments_parentId_fkey";

-- DropForeignKey
ALTER TABLE "memories" DROP CONSTRAINT "memories_authorId_fkey";

-- DropForeignKey
ALTER TABLE "memories" DROP CONSTRAINT "memories_batchId_fkey";

-- DropIndex
DROP INDEX "batch_invitations_batchId_idx";

-- DropIndex
DROP INDEX "batch_invitations_receiverId_batchId_key";

-- DropIndex
DROP INDEX "batch_invitations_receiverId_idx";

-- DropIndex
DROP INDEX "batch_members_batchId_idx";

-- DropIndex
DROP INDEX "batches_academicYear_idx";

-- DropIndex
DROP INDEX "batches_institution_idx";

-- DropIndex
DROP INDEX "batches_inviteCode_idx";

-- DropIndex
DROP INDEX "comments_authorId_idx";

-- DropIndex
DROP INDEX "comments_createdAt_idx";

-- DropIndex
DROP INDEX "comments_memoryId_idx";

-- DropIndex
DROP INDEX "memories_authorId_idx";

-- DropIndex
DROP INDEX "memories_batchId_idx";

-- DropIndex
DROP INDEX "memories_category_idx";

-- DropIndex
DROP INDEX "memories_createdAt_idx";

-- DropIndex
DROP INDEX "memories_status_idx";

-- DropIndex
DROP INDEX "memories_tags_idx";

-- DropIndex
DROP INDEX "notifications_createdAt_idx";

-- DropIndex
DROP INDEX "notifications_isRead_idx";

-- DropIndex
DROP INDEX "notifications_userId_idx";

-- DropIndex
DROP INDEX "reactions_memoryId_idx";

-- DropIndex
DROP INDEX "users_createdAt_idx";

-- DropIndex
DROP INDEX "users_email_idx";

-- AlterTable
ALTER TABLE "batch_invitations" DROP COLUMN "message",
DROP COLUMN "status",
DROP COLUMN "updatedAt",
ADD COLUMN     "expiresAt" TIMESTAMP(3) NOT NULL,
ADD COLUMN     "token" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "batch_members" DROP COLUMN "role",
ADD COLUMN     "role" "Role" NOT NULL DEFAULT 'MEMBER';

-- AlterTable
ALTER TABLE "batches" DROP COLUMN "settings",
ADD COLUMN     "avatar" TEXT,
ADD COLUMN     "createdById" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "comments" DROP COLUMN "authorId",
DROP COLUMN "isEdited",
DROP COLUMN "parentId",
ADD COLUMN     "userId" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "memories" DROP COLUMN "authorId",
DROP COLUMN "metadata",
DROP COLUMN "viewCount",
ADD COLUMN     "createdById" TEXT NOT NULL,
ADD COLUMN     "location" TEXT,
DROP COLUMN "category",
ADD COLUMN     "category" "Category" NOT NULL DEFAULT 'GENERAL',
ALTER COLUMN "status" SET DEFAULT 'ACTIVE',
ALTER COLUMN "batchId" DROP NOT NULL;

-- AlterTable
ALTER TABLE "notifications" DROP COLUMN "data",
ADD COLUMN     "metadata" JSONB;

-- AlterTable
ALTER TABLE "users" DROP COLUMN "achievements",
DROP COLUMN "isVerified",
DROP COLUMN "lastLoginAt",
DROP COLUMN "otpCode",
DROP COLUMN "otpExpiresAt",
DROP COLUMN "role",
ADD COLUMN     "isActive" BOOLEAN NOT NULL DEFAULT true,
ADD COLUMN     "passwordHash" TEXT NOT NULL;

-- DropEnum
DROP TYPE "BatchMemberRole";

-- DropEnum
DROP TYPE "InvitationStatus";

-- DropEnum
DROP TYPE "MemoryCategory";

-- DropEnum
DROP TYPE "UserRole";

-- CreateTable
CREATE TABLE "otps" (
    "id" TEXT NOT NULL,
    "identifier" TEXT NOT NULL,
    "code" TEXT NOT NULL,
    "type" TEXT NOT NULL DEFAULT 'email',
    "expiresAt" TIMESTAMP(3) NOT NULL,
    "attempts" INTEGER NOT NULL DEFAULT 0,
    "isUsed" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "otps_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "otps_identifier_key" ON "otps"("identifier");

-- CreateIndex
CREATE UNIQUE INDEX "batch_invitations_token_key" ON "batch_invitations"("token");

-- AddForeignKey
ALTER TABLE "batches" ADD CONSTRAINT "batches_createdById_fkey" FOREIGN KEY ("createdById") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "memories" ADD CONSTRAINT "memories_createdById_fkey" FOREIGN KEY ("createdById") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "memories" ADD CONSTRAINT "memories_batchId_fkey" FOREIGN KEY ("batchId") REFERENCES "batches"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "comments" ADD CONSTRAINT "comments_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
