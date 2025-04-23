/*
  Warnings:

  - The `width` column on the `wheel_interaction` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The `height` column on the `wheel_interaction` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The `diameter` column on the `wheel_interaction` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- AlterTable
ALTER TABLE "wheel_interaction" DROP COLUMN "width",
ADD COLUMN     "width" DOUBLE PRECISION,
DROP COLUMN "height",
ADD COLUMN     "height" INTEGER,
DROP COLUMN "diameter",
ADD COLUMN     "diameter" INTEGER;
