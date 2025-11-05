/*
  Warnings:

  - A unique constraint covering the columns `[qrCode]` on the table `Contract` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "Contract_qrCode_key" ON "public"."Contract"("qrCode");
