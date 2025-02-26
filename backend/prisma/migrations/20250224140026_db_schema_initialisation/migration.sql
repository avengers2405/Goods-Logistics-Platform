-- CreateEnum
CREATE TYPE "VehicleType" AS ENUM ('SMALL', 'MEDIUM', 'LARGE', 'TRUCK');

-- CreateEnum
CREATE TYPE "Status" AS ENUM ('PENDING', 'ONGOING', 'COMPLETED', 'CANCELLED');

-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL,
    "firstName" TEXT NOT NULL,
    "lastName" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "clerkId" TEXT NOT NULL,
    "phone" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "credits" INTEGER NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Address" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "latitude" DOUBLE PRECISION NOT NULL,
    "longitude" DOUBLE PRECISION NOT NULL,
    "streetName" TEXT,
    "town" TEXT,
    "city" TEXT,
    "state" TEXT,

    CONSTRAINT "Address_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Driver" (
    "id" TEXT NOT NULL,
    "firstName" TEXT NOT NULL,
    "lastName" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "clerkId" TEXT NOT NULL,
    "phone" TEXT NOT NULL,
    "vehicleId" TEXT NOT NULL,
    "rating" DOUBLE PRECISION NOT NULL,
    "adminId" TEXT NOT NULL,

    CONSTRAINT "Driver_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Admin" (
    "id" TEXT NOT NULL,
    "firstName" TEXT NOT NULL,
    "lastName" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "clerkId" TEXT NOT NULL,
    "phone" TEXT NOT NULL,

    CONSTRAINT "Admin_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Vehicle" (
    "id" TEXT NOT NULL,
    "liscencePlate" TEXT NOT NULL,
    "type" "VehicleType" NOT NULL,
    "driverId" TEXT,

    CONSTRAINT "Vehicle_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Booking" (
    "id" TEXT NOT NULL,
    "driverId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "pickupLocation" JSONB NOT NULL,
    "dropoffLocation" JSONB NOT NULL,
    "price" DOUBLE PRECISION NOT NULL,
    "goodsDetails" TEXT,
    "status" "Status" NOT NULL DEFAULT 'PENDING',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Booking_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "LiveLocation" (
    "driverId" TEXT NOT NULL,
    "latitutde" DOUBLE PRECISION NOT NULL,
    "longitude" DOUBLE PRECISION NOT NULL,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "LiveLocation_pkey" PRIMARY KEY ("driverId")
);

-- CreateTable
CREATE TABLE "LocationHistory" (
    "driverId" TEXT NOT NULL,
    "latitutde" DOUBLE PRECISION NOT NULL,
    "longitude" DOUBLE PRECISION NOT NULL,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "LocationHistory_pkey" PRIMARY KEY ("driverId","updatedAt")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_clerkId_key" ON "User"("clerkId");

-- CreateIndex
CREATE UNIQUE INDEX "Driver_clerkId_key" ON "Driver"("clerkId");

-- CreateIndex
CREATE UNIQUE INDEX "Admin_clerkId_key" ON "Admin"("clerkId");

-- CreateIndex
CREATE UNIQUE INDEX "Vehicle_liscencePlate_key" ON "Vehicle"("liscencePlate");

-- CreateIndex
CREATE UNIQUE INDEX "Vehicle_driverId_key" ON "Vehicle"("driverId");

-- AddForeignKey
ALTER TABLE "Address" ADD CONSTRAINT "Address_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Driver" ADD CONSTRAINT "Driver_adminId_fkey" FOREIGN KEY ("adminId") REFERENCES "Admin"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Vehicle" ADD CONSTRAINT "Vehicle_driverId_fkey" FOREIGN KEY ("driverId") REFERENCES "Driver"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Booking" ADD CONSTRAINT "Booking_driverId_fkey" FOREIGN KEY ("driverId") REFERENCES "Driver"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Booking" ADD CONSTRAINT "Booking_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "LiveLocation" ADD CONSTRAINT "LiveLocation_driverId_fkey" FOREIGN KEY ("driverId") REFERENCES "Driver"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "LocationHistory" ADD CONSTRAINT "LocationHistory_driverId_fkey" FOREIGN KEY ("driverId") REFERENCES "Driver"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- Enable PostGIS extension
CREATE EXTENSION IF NOT EXISTS postgis;

-- Add a geography column to the LiveLocation table
ALTER TABLE "LiveLocation" ADD COLUMN geom geography(POINT, 4326);

-- Create a function to automatically update the geom column
CREATE OR REPLACE FUNCTION update_geom()
RETURNS TRIGGER AS $$
BEGIN
    NEW.geom = ST_SetSRID(ST_MakePoint(NEW.longitude, NEW.latitude), 4326)::geography;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create a trigger to maintain the geom column
CREATE TRIGGER update_live_location_geom
BEFORE INSERT OR UPDATE ON "LiveLocation"
FOR EACH ROW
EXECUTE FUNCTION update_geom();

-- Create a spatial index on the geom column
CREATE INDEX live_location_geom_idx ON "LiveLocation" USING GIST(geom);