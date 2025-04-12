-- AlterTable
ALTER TABLE "car" ALTER COLUMN "year" DROP NOT NULL,
ALTER COLUMN "fuel_capacity" DROP NOT NULL,
ALTER COLUMN "odometer_units" SET DEFAULT 'kilometer',
ALTER COLUMN "engine_hours_enabled" SET DEFAULT false;
