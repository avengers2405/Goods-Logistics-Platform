-- AlterTable
ALTER TABLE "LiveLocation" ADD COLUMN     "geom" geography;

-- CreateIndex
CREATE INDEX "live_location_geom_idx" ON "LiveLocation" USING GIST ("geom");
