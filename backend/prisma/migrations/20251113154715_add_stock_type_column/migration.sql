-- AlterTable
ALTER TABLE "public"."Holding" ALTER COLUMN "quantity" SET DATA TYPE DECIMAL(65,30);

-- AlterTable
ALTER TABLE "public"."Order" ALTER COLUMN "quantity" SET DATA TYPE DECIMAL(65,30);

-- AlterTable
ALTER TABLE "public"."Stock" ADD COLUMN     "type" TEXT NOT NULL DEFAULT 'stock';

-- AlterTable
ALTER TABLE "public"."Transaction" ALTER COLUMN "quantity" SET DATA TYPE DECIMAL(65,30);
