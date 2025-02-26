-- CreateTable
CREATE TABLE "Notifications" (
    "id" TEXT NOT NULL,
    "driverId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "pickupLocation" JSONB NOT NULL,
    "dropoffLocation" JSONB NOT NULL,
    "price" DOUBLE PRECISION NOT NULL,
    "goodsDetails" TEXT,

    CONSTRAINT "Notifications_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "Notifications_driverId_idx" ON "Notifications" USING HASH ("driverId");

-- CreateIndex
CREATE INDEX "LocationHistory_driverId_idx" ON "LocationHistory" USING BRIN ("driverId");

-- AddForeignKey
ALTER TABLE "Notifications" ADD CONSTRAINT "Notifications_driverId_fkey" FOREIGN KEY ("driverId") REFERENCES "Driver"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Notifications" ADD CONSTRAINT "Notifications_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
