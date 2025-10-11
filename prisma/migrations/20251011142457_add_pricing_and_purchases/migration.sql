-- AlterTable
ALTER TABLE "codeplace"."Template" ADD COLUMN     "isPaid" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "price" DECIMAL(10,2) NOT NULL DEFAULT 0;

-- CreateTable
CREATE TABLE "codeplace"."Purchase" (
    "id" TEXT NOT NULL,
    "templateId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "amount" DECIMAL(10,2) NOT NULL,
    "currency" TEXT NOT NULL DEFAULT 'AZN',
    "orderId" TEXT NOT NULL,
    "epointOrderId" TEXT,
    "status" TEXT NOT NULL DEFAULT 'pending',
    "paymentMethod" TEXT,
    "transactionId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Purchase_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Purchase_orderId_key" ON "codeplace"."Purchase"("orderId");

-- CreateIndex
CREATE INDEX "Purchase_templateId_idx" ON "codeplace"."Purchase"("templateId");

-- CreateIndex
CREATE INDEX "Purchase_userId_idx" ON "codeplace"."Purchase"("userId");

-- CreateIndex
CREATE INDEX "Purchase_orderId_idx" ON "codeplace"."Purchase"("orderId");
