/*
  Warnings:

  - A unique constraint covering the columns `[url,productId]` on the table `product_images` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "product_images_url_productId_key" ON "product_images"("url", "productId");
