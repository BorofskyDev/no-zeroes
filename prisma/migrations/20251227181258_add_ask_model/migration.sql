-- CreateEnum
CREATE TYPE "AskFlowType" AS ENUM ('PERSONAL', 'BUSINESS');

-- CreateEnum
CREATE TYPE "YesNo" AS ENUM ('YES', 'NO');

-- CreateEnum
CREATE TYPE "CardStatus" AS ENUM ('HAS_CARD', 'NO_CARD');

-- CreateTable
CREATE TABLE "Ask" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "flowType" "AskFlowType" NOT NULL,
    "didAsk" "YesNo" NOT NULL,
    "cardStatus" "CardStatus",
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Ask_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "Ask_userId_idx" ON "Ask"("userId");

-- CreateIndex
CREATE INDEX "Ask_createdAt_idx" ON "Ask"("createdAt");

-- CreateIndex
CREATE INDEX "Ask_userId_createdAt_idx" ON "Ask"("userId", "createdAt");

-- AddForeignKey
ALTER TABLE "Ask" ADD CONSTRAINT "Ask_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
