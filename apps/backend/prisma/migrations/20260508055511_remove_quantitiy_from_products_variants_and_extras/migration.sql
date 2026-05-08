/*
  Warnings:

  - You are about to drop the column `quantity` on the `product_extras` table. All the data in the column will be lost.
  - You are about to drop the column `quantity` on the `product_variants` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "product_extras" DROP COLUMN "quantity";

-- AlterTable
ALTER TABLE "product_variants" DROP COLUMN "quantity";
