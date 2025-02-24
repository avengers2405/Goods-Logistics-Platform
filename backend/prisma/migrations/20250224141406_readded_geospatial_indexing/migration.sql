-- This is an empty migration.

-- Enable PostGIS extension
CREATE EXTENSION IF NOT EXISTS postgis;

-- Add a geography column to the LiveLocation table
ALTER TABLE "LiveLocation" ADD COLUMN geom geography(POINT, 4326);

-- Create a spatial index on the geom column
CREATE INDEX live_location_geom_idx ON "LiveLocation" USING GIST(geom);