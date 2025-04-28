import { WheelInteraction } from '@prisma/client'
import { WheelInteractionDto } from '../dto/wheel-interaction.dto'

export function transformWheelData(
    value: WheelInteraction
): WheelInteractionDto {
    const {
        wheelType,
        tireType,
        rimType,
        brand,
        model,
        width,
        height,
        diameter
    } = value

    return {
        wheelType,
        tireType,
        rimType,
        brand,
        model,
        width,
        height,
        diameter
    }
}
