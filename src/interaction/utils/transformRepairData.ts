import { RepairOnInteraction } from '@prisma/client'
import { RepairInteractionDto } from '../dto/repair-interaction.dto'

export function transformRepairData(
    values: RepairOnInteraction[]
): RepairInteractionDto {
    return { ids: values.map(value => value.repairId) }
}
