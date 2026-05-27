-- DropForeignKey
ALTER TABLE "CartItemExtra" DROP CONSTRAINT "CartItemExtra_cartItemId_fkey";

-- AddForeignKey
ALTER TABLE "CartItemExtra" ADD CONSTRAINT "CartItemExtra_cartItemId_fkey" FOREIGN KEY ("cartItemId") REFERENCES "CartItem"("id") ON DELETE CASCADE ON UPDATE CASCADE;
