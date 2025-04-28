import { FuelInteraction } from '@prisma/client'
import { FuelInteractionDto } from '../dto/fuel-interaction.dto'

export function transformFuelData(value: FuelInteraction): FuelInteractionDto {
    const {
        fuelGrade,
        capacity,
        price,
        beforeRefueling,
        afterRefueling,
        capacityFull
    } = value

    return {
        fuelGrade,
        capacity,
        price,
        beforeRefueling,
        afterRefueling,
        capacityFull
    }
}
