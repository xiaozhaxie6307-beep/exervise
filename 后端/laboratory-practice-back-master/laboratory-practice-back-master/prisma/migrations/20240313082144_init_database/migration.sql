/*
  Warnings:

  - Added the required column `updatedAt` to the `scale_diagnostic_info` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "scale_diagnostic_info" ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL;
