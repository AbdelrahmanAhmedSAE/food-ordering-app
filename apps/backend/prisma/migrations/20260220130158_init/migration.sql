/*
  Warnings:

  - You are about to drop the column `sort_order` on the `product_categories` table. All the data in the column will be lost.
  - Added the required column `sortOrder` to the `product_categories` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "product_categories" DROP COLUMN "sort_order",
ADD COLUMN     "sortOrder" INTEGER NOT NULL;
