/*
  Warnings:

  - Made the column `scaleId` on table `scale_diagnostic_info` required. This step will fail if there are existing NULL values in that column.

*/
-- DropForeignKey
ALTER TABLE "scale_diagnostic_info" DROP CONSTRAINT "scale_diagnostic_info_scaleId_fkey";

-- AlterTable
ALTER TABLE "scale_diagnostic_info" ALTER COLUMN "scaleId" SET NOT NULL;

-- AddForeignKey
ALTER TABLE "scale_diagnostic_info" ADD CONSTRAINT "scale_diagnostic_info_scaleId_fkey" FOREIGN KEY ("scaleId") REFERENCES "scales"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
