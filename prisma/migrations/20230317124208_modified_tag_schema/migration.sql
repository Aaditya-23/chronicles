/*
  Warnings:

  - You are about to drop the column `color` on the `Tag` table. All the data in the column will be lost.
  - You are about to drop the column `description` on the `Tag` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Tag" DROP COLUMN "color",
DROP COLUMN "description";