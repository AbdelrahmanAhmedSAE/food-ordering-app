/*
  Warnings:

  - You are about to drop the column `sortOrder` on the `categories` table. All the data in the column will be lost.
  - You are about to drop the column `sortOrder` on the `product_categories` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "categories" DROP COLUMN "sortOrder";

-- AlterTable
ALTER TABLE "product_categories" DROP COLUMN "sortOrder";
