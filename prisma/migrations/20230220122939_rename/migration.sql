/*
  Warnings:

  - You are about to drop the column `preferencesId` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `profileId` on the `User` table. All the data in the column will be lost.
  - You are about to drop the `UserPreferences` table. If the table is not empty, all the data it contains will be lost.
  - A unique constraint covering the columns `[userProfileId]` on the table `User` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[userPreferenceId]` on the table `User` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `userPreferenceId` to the `User` table without a default value. This is not possible if the table is not empty.
  - Added the required column `userProfileId` to the `User` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "User" DROP CONSTRAINT "User_preferencesId_fkey";

-- DropForeignKey
ALTER TABLE "User" DROP CONSTRAINT "User_profileId_fkey";

-- DropIndex
DROP INDEX "User_preferencesId_key";

-- DropIndex
DROP INDEX "User_profileId_key";

-- AlterTable
ALTER TABLE "User" DROP COLUMN "preferencesId",
DROP COLUMN "profileId",
ADD COLUMN     "userPreferenceId" TEXT NOT NULL,
ADD COLUMN     "userProfileId" TEXT NOT NULL;

-- DropTable
DROP TABLE "UserPreferences";

-- CreateTable
CREATE TABLE "UserPreference" (
    "id" TEXT NOT NULL,
    "theme" "THEME",
    "receiveEmails" BOOLEAN NOT NULL DEFAULT true,

    CONSTRAINT "UserPreference_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_userProfileId_key" ON "User"("userProfileId");

-- CreateIndex
CREATE UNIQUE INDEX "User_userPreferenceId_key" ON "User"("userPreferenceId");

-- AddForeignKey
ALTER TABLE "User" ADD CONSTRAINT "User_userProfileId_fkey" FOREIGN KEY ("userProfileId") REFERENCES "UserProfile"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "User" ADD CONSTRAINT "User_userPreferenceId_fkey" FOREIGN KEY ("userPreferenceId") REFERENCES "UserPreference"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
