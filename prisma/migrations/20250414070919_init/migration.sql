-- CreateEnum
CREATE TYPE "FuelType" AS ENUM ('gasoline', 'gas', 'hybrid', 'diesel', 'electric');

-- CreateEnum
CREATE TYPE "OdometerUnits" AS ENUM ('kilometer', 'mile');

-- CreateEnum
CREATE TYPE "FuelGrade" AS ENUM ('ai80', 'ai92', 'ai95', 'ai95_plus', 'ai98', 'ai98_plus', 'ai100', 'diesel', 'diesel_plus', 'gas', 'electric');

-- CreateEnum
CREATE TYPE "InteractionCategory" AS ENUM ('mileage', 'parking', 'toll_road', 'taxi', 'sober_driver', 'alarm_system', 'fuel', 'wash', 'maintenance', 'tire_service', 'repair', 'part', 'purchase_wheels', 'tow_truck', 'insurance', 'tax', 'state_inspection', 'fine', 'car_purchase', 'loan_repayment', 'leasing', 'car_purchases', 'tuning', 'driver_salary');

-- CreateEnum
CREATE TYPE "PartOption" AS ENUM ('oil', 'filter', 'brake_pads_and_discs', 'coolant', 'windshield_washer', 'spark_plugs');

-- CreateEnum
CREATE TYPE "RepairOption" AS ENUM ('engine_oil', 'transmission_oil', 'oil_filter', 'air_filter', 'cabin_filter', 'front_brake_pads', 'rear_brake_pads', 'brake_fluid', 'front_brake_discs', 'rear_brake_discs', 'air_conditioner_refill', 'spark_plugs', 'coolant', 'alignment', 'timing_belt', 'fuel_filter', 'transfer_case_oil', 'differential_oil', 'car_battery', 'power_steering_fluid', 'clutch');

-- CreateEnum
CREATE TYPE "Language" AS ENUM ('ru', 'en');

-- CreateEnum
CREATE TYPE "WheelType" AS ENUM ('tire', 'rim');

-- CreateEnum
CREATE TYPE "TireType" AS ENUM ('summer', 'winter', 'all_season');

-- CreateEnum
CREATE TYPE "RimType" AS ENUM ('forged', 'cast', 'stamped');

-- CreateTable
CREATE TABLE "car" (
    "id" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "is_default" BOOLEAN NOT NULL DEFAULT false,
    "brand" TEXT NOT NULL,
    "model" TEXT,
    "name" TEXT,
    "year" INTEGER,
    "fuel_type" "FuelType" NOT NULL DEFAULT 'gasoline',
    "fuel_capacity" INTEGER,
    "mileage" INTEGER NOT NULL,
    "odometer_units" "OdometerUnits" NOT NULL DEFAULT 'kilometer',
    "engine_hours_enabled" BOOLEAN NOT NULL DEFAULT false,
    "engine_hours" INTEGER,
    "user_id" TEXT NOT NULL,

    CONSTRAINT "car_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "fuel_interaction" (
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "fuel_grade" "FuelGrade" NOT NULL DEFAULT 'ai92',
    "capacity" INTEGER,
    "price" INTEGER,
    "before_refueling" INTEGER,
    "after_refueling" INTEGER,
    "capacity_full" BOOLEAN,
    "interaction_id" TEXT NOT NULL,

    CONSTRAINT "fuel_interaction_pkey" PRIMARY KEY ("interaction_id")
);

-- CreateTable
CREATE TABLE "interaction" (
    "id" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "type" "InteractionCategory" NOT NULL,
    "date" TIMESTAMP(3) NOT NULL,
    "mileage" INTEGER,
    "amount" INTEGER NOT NULL,
    "engine_hours" INTEGER,
    "description" TEXT,
    "car_id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,

    CONSTRAINT "interaction_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "part_on_interaction" (
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "interactionId" TEXT NOT NULL,
    "partId" TEXT NOT NULL,

    CONSTRAINT "part_on_interaction_pkey" PRIMARY KEY ("interactionId","partId")
);

-- CreateTable
CREATE TABLE "part" (
    "id" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "option" TEXT NOT NULL,
    "is_default" BOOLEAN NOT NULL DEFAULT true,
    "is_visible" BOOLEAN NOT NULL DEFAULT true,
    "car_id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,

    CONSTRAINT "part_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "repair_on_interaction" (
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "interactionId" TEXT NOT NULL,
    "repairId" TEXT NOT NULL,

    CONSTRAINT "repair_on_interaction_pkey" PRIMARY KEY ("interactionId","repairId")
);

-- CreateTable
CREATE TABLE "repair" (
    "id" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "option" TEXT NOT NULL,
    "mileage" INTEGER,
    "days" INTEGER,
    "is_default" BOOLEAN NOT NULL DEFAULT false,
    "is_visible" BOOLEAN NOT NULL DEFAULT true,
    "car_id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,

    CONSTRAINT "repair_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "user" (
    "id" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "language" "Language" NOT NULL DEFAULT 'ru',
    "timezone" TEXT NOT NULL DEFAULT 'Europe/Moscow',

    CONSTRAINT "user_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "wheel_interaction" (
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "wheel_type" "WheelType" NOT NULL DEFAULT 'tire',
    "tire_type" "TireType",
    "rim_type" "RimType",
    "brand" TEXT,
    "model" TEXT,
    "width" TEXT,
    "height" TEXT,
    "diameter" TEXT,
    "interaction_id" TEXT NOT NULL,

    CONSTRAINT "wheel_interaction_pkey" PRIMARY KEY ("interaction_id")
);

-- AddForeignKey
ALTER TABLE "car" ADD CONSTRAINT "car_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "fuel_interaction" ADD CONSTRAINT "fuel_interaction_interaction_id_fkey" FOREIGN KEY ("interaction_id") REFERENCES "interaction"("id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "interaction" ADD CONSTRAINT "interaction_car_id_fkey" FOREIGN KEY ("car_id") REFERENCES "car"("id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "interaction" ADD CONSTRAINT "interaction_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "part_on_interaction" ADD CONSTRAINT "part_on_interaction_interactionId_fkey" FOREIGN KEY ("interactionId") REFERENCES "interaction"("id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "part_on_interaction" ADD CONSTRAINT "part_on_interaction_partId_fkey" FOREIGN KEY ("partId") REFERENCES "part"("id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "part" ADD CONSTRAINT "part_car_id_fkey" FOREIGN KEY ("car_id") REFERENCES "car"("id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "part" ADD CONSTRAINT "part_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "repair_on_interaction" ADD CONSTRAINT "repair_on_interaction_interactionId_fkey" FOREIGN KEY ("interactionId") REFERENCES "interaction"("id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "repair_on_interaction" ADD CONSTRAINT "repair_on_interaction_repairId_fkey" FOREIGN KEY ("repairId") REFERENCES "repair"("id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "repair" ADD CONSTRAINT "repair_car_id_fkey" FOREIGN KEY ("car_id") REFERENCES "car"("id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "repair" ADD CONSTRAINT "repair_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "wheel_interaction" ADD CONSTRAINT "wheel_interaction_interaction_id_fkey" FOREIGN KEY ("interaction_id") REFERENCES "interaction"("id") ON DELETE CASCADE ON UPDATE NO ACTION;
