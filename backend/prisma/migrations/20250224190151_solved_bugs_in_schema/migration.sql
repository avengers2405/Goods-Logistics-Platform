/*
  Warnings:

  - You are about to drop the column `driverId` on the `Vehicle` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[vehicleId]` on the table `Driver` will be added. If there are existing duplicate values, this will fail.

*/
-- DropForeignKey
ALTER TABLE "Driver" DROP CONSTRAINT "Driver_adminId_fkey";

-- DropForeignKey
ALTER TABLE "Vehicle" DROP CONSTRAINT "Vehicle_driverId_fkey";

-- DropIndex
DROP INDEX "Vehicle_driverId_key";

-- AlterTable
ALTER TABLE "Driver" ALTER COLUMN "vehicleId" DROP NOT NULL,
ALTER COLUMN "rating" SET DEFAULT 5,
ALTER COLUMN "adminId" DROP NOT NULL;

-- AlterTable
ALTER TABLE "User" ALTER COLUMN "credits" SET DEFAULT 0;

-- AlterTable
ALTER TABLE "Vehicle" DROP COLUMN "driverId";

-- CreateIndex
CREATE UNIQUE INDEX "Driver_vehicleId_key" ON "Driver"("vehicleId");

-- AddForeignKey
ALTER TABLE "Driver" ADD CONSTRAINT "Driver_adminId_fkey" FOREIGN KEY ("adminId") REFERENCES "Admin"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Driver" ADD CONSTRAINT "Driver_vehicleId_fkey" FOREIGN KEY ("vehicleId") REFERENCES "Vehicle"("id") ON DELETE SET NULL ON UPDATE CASCADE;
