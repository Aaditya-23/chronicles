/*
  Warnings:

  - You are about to drop the column `parentCommentId` on the `Comment` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "Comment" DROP CONSTRAINT "Comment_parentCommentId_fkey";

-- AlterTable
ALTER TABLE "Comment" DROP COLUMN "parentCommentId";

-- CreateTable
CREATE TABLE "CommentReply" (
    "id" TEXT NOT NULL,
    "body" TEXT NOT NULL,
    "parentCommentId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "CommentReply_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "CommentReply" ADD CONSTRAINT "CommentReply_parentCommentId_fkey" FOREIGN KEY ("parentCommentId") REFERENCES "Comment"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
