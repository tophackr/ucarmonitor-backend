-- DropForeignKey
ALTER TABLE "part_on_interaction" DROP CONSTRAINT "part_on_interaction_interactionId_fkey";

-- DropForeignKey
ALTER TABLE "part_on_interaction" DROP CONSTRAINT "part_on_interaction_partId_fkey";

-- DropForeignKey
ALTER TABLE "repair_on_interaction" DROP CONSTRAINT "repair_on_interaction_interactionId_fkey";

-- DropForeignKey
ALTER TABLE "repair_on_interaction" DROP CONSTRAINT "repair_on_interaction_repairId_fkey";

-- AddForeignKey
ALTER TABLE "part_on_interaction" ADD CONSTRAINT "part_on_interaction_interactionId_fkey" FOREIGN KEY ("interactionId") REFERENCES "interaction"("id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "part_on_interaction" ADD CONSTRAINT "part_on_interaction_partId_fkey" FOREIGN KEY ("partId") REFERENCES "part"("id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "repair_on_interaction" ADD CONSTRAINT "repair_on_interaction_interactionId_fkey" FOREIGN KEY ("interactionId") REFERENCES "interaction"("id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "repair_on_interaction" ADD CONSTRAINT "repair_on_interaction_repairId_fkey" FOREIGN KEY ("repairId") REFERENCES "repair"("id") ON DELETE CASCADE ON UPDATE NO ACTION;
