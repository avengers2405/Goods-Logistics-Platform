/*
  Warnings:

  - You are about to drop the column `geom` on the `LiveLocation` table. All the data in the column will be lost.

*/
-- DropIndex
DROP INDEX "live_location_geom_idx";

-- AlterTable
ALTER TABLE "LiveLocation" DROP COLUMN "geom";