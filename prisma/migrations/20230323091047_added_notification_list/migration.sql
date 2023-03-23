-- CreateTable
CREATE TABLE "BlogPublishNotification" (
    "id" TEXT NOT NULL,
    "message" TEXT NOT NULL,
    "url" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "BlogPublishNotification_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "BlogPublishNotification" ADD CONSTRAINT "BlogPublishNotification_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
