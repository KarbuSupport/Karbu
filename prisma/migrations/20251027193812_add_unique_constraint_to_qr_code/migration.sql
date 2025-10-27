/*
  Warnings:

  - Made the column `qrCode` on table `Contract` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "public"."Contract" ALTER COLUMN "qrCode" SET NOT NULL;
