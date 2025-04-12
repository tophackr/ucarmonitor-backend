/*
  Warnings:

  - The primary key for the `fuel_interaction` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `id` on the `fuel_interaction` table. All the data in the column will be lost.
  - The primary key for the `wheel_interaction` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `id` on the `wheel_interaction` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "fuel_interaction" DROP CONSTRAINT "fuel_interaction_pkey",
DROP COLUMN "id",
ADD CONSTRAINT "fuel_interaction_pkey" PRIMARY KEY ("interaction_id");

-- AlterTable
ALTER TABLE "wheel_interaction" DROP CONSTRAINT "wheel_interaction_pkey",
DROP COLUMN "id",
ADD CONSTRAINT "wheel_interaction_pkey" PRIMARY KEY ("interaction_id");
