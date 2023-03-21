/*
  Warnings:

  - You are about to drop the `CommentReply` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "CommentReply" DROP CONSTRAINT "CommentReply_parentCommentId_fkey";

-- DropTable
DROP TABLE "CommentReply";
