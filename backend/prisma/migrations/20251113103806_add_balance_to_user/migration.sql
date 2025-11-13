-- CreateTable
CREATE TABLE "public"."User" (
    "id" TEXT NOT NULL,
    "username" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "balance" DECIMAL(65,30) NOT NULL DEFAULT 100000.00,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."Stock" (
    "stock_id" SERIAL NOT NULL,
    "symbol" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "current_price" DECIMAL(65,30) NOT NULL DEFAULT 100.00,
    "last_updated" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Stock_pkey" PRIMARY KEY ("stock_id")
);

-- CreateTable
CREATE TABLE "public"."Order" (
    "order_id" SERIAL NOT NULL,
    "user_id" TEXT NOT NULL,
    "stock_id" INTEGER NOT NULL,
    "type" TEXT NOT NULL,
    "quantity" INTEGER NOT NULL,
    "price" DECIMAL(65,30) NOT NULL,
    "status" TEXT NOT NULL,
    "timestamp" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Order_pkey" PRIMARY KEY ("order_id")
);

-- CreateTable
CREATE TABLE "public"."Holding" (
    "holding_id" SERIAL NOT NULL,
    "user_id" TEXT NOT NULL,
    "stock_id" INTEGER NOT NULL,
    "quantity" INTEGER NOT NULL,
    "avg_price" DECIMAL(65,30) NOT NULL,

    CONSTRAINT "Holding_pkey" PRIMARY KEY ("holding_id")
);

-- CreateTable
CREATE TABLE "public"."Transaction" (
    "txn_id" SERIAL NOT NULL,
    "user_id" TEXT NOT NULL,
    "stock_id" INTEGER NOT NULL,
    "action" TEXT NOT NULL,
    "quantity" INTEGER NOT NULL,
    "price" DECIMAL(65,30) NOT NULL,
    "timestamp" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Transaction_pkey" PRIMARY KEY ("txn_id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "public"."User"("email");

-- CreateIndex
CREATE UNIQUE INDEX "Stock_symbol_key" ON "public"."Stock"("symbol");

-- CreateIndex
CREATE UNIQUE INDEX "Holding_user_id_stock_id_key" ON "public"."Holding"("user_id", "stock_id");

-- AddForeignKey
ALTER TABLE "public"."Order" ADD CONSTRAINT "Order_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "public"."User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Order" ADD CONSTRAINT "Order_stock_id_fkey" FOREIGN KEY ("stock_id") REFERENCES "public"."Stock"("stock_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Holding" ADD CONSTRAINT "Holding_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "public"."User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Holding" ADD CONSTRAINT "Holding_stock_id_fkey" FOREIGN KEY ("stock_id") REFERENCES "public"."Stock"("stock_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Transaction" ADD CONSTRAINT "Transaction_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "public"."User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Transaction" ADD CONSTRAINT "Transaction_stock_id_fkey" FOREIGN KEY ("stock_id") REFERENCES "public"."Stock"("stock_id") ON DELETE RESTRICT ON UPDATE CASCADE;
