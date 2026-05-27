-- AlterTable
ALTER TABLE "CartItem" ADD COLUMN     "totalPrice" DECIMAL(65,30) NOT NULL DEFAULT 0;

-- AlterTable
ALTER TABLE "CartItemExtra" ADD COLUMN     "totalPrice" DECIMAL(65,30) NOT NULL DEFAULT 0;

-- AlterTable
ALTER TABLE "carts" ADD COLUMN     "totalPrice" DECIMAL(65,30) NOT NULL DEFAULT 0;
