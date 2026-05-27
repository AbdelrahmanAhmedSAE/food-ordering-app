/*
  Warnings:

  - A unique constraint covering the columns `[cartId,productVariantId,extrasHash]` on the table `CartItem` will be added. If there are existing duplicate values, this will fail.

*/
-- DropIndex
DROP INDEX "CartItem_cartId_productVariantId_key";

-- AlterTable
ALTER TABLE "CartItem" ADD COLUMN     "extrasHash" TEXT NOT NULL DEFAULT '';

-- CreateIndex
CREATE UNIQUE INDEX "CartItem_cartId_productVariantId_extrasHash_key" ON "CartItem"("cartId", "productVariantId", "extrasHash");
