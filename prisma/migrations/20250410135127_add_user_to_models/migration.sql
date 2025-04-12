/*
  Warnings:

  - Added the required column `user_id` to the `interaction` table without a default value. This is not possible if the table is not empty.
  - Added the required column `car_id` to the `part` table without a default value. This is not possible if the table is not empty.
  - Added the required column `user_id` to the `part` table without a default value. This is not possible if the table is not empty.
  - Added the required column `car_id` to the `repair` table without a default value. This is not possible if the table is not empty.
  - Added the required column `user_id` to the `repair` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "interaction" ADD COLUMN     "user_id" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "part" ADD COLUMN     "car_id" TEXT NOT NULL,
ADD COLUMN     "user_id" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "repair" ADD COLUMN     "car_id" TEXT NOT NULL,
ADD COLUMN     "user_id" TEXT NOT NULL;

-- AddForeignKey
ALTER TABLE "interaction" ADD CONSTRAINT "interaction_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "part" ADD CONSTRAINT "part_car_id_fkey" FOREIGN KEY ("car_id") REFERENCES "car"("id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "part" ADD CONSTRAINT "part_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "repair" ADD CONSTRAINT "repair_car_id_fkey" FOREIGN KEY ("car_id") REFERENCES "car"("id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "repair" ADD CONSTRAINT "repair_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE NO ACTION;
