import { PartOnInteraction } from '@prisma/client'
import { PartInteractionDto } from '../dto/part-interaction.dto'

export function transformPartData(
    values: PartOnInteraction[]
): PartInteractionDto {
    return { ids: values.map(value => value.partId) }
}
