/*
  Warnings:

  - The values [parts,purchase_tires] on the enum `InteractionCategory` will be removed. If these variants are still used in the database, this will fail.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "InteractionCategory_new" AS ENUM ('mileage', 'parking', 'toll_road', 'taxi', 'sober_driver', 'alarm_system', 'fuel', 'wash', 'maintenance', 'tire_service', 'repair', 'part', 'purchase_wheels', 'tow_truck', 'insurance', 'tax', 'state_inspection', 'fine', 'car_purchase', 'loan_repayment', 'leasing', 'car_purchases', 'tuning', 'driver_salary');
ALTER TABLE "interaction" ALTER COLUMN "type" TYPE "InteractionCategory_new" USING ("type"::text::"InteractionCategory_new");
ALTER TYPE "InteractionCategory" RENAME TO "InteractionCategory_old";
ALTER TYPE "InteractionCategory_new" RENAME TO "InteractionCategory";
DROP TYPE "InteractionCategory_old";
COMMIT;
