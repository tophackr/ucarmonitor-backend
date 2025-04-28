import { allowedFieldsDto } from '@/common/allow-fields-dto'
import { validateExists } from '@/common/validate-entity.guard'
import { PrismaService } from '@/prisma/prisma.service'
import { Injectable } from '@nestjs/common'
import { WheelInteractionDto } from './dto/wheel-interaction.dto'
import { transformWheelData } from './utils/transformWheelData'

const ENTITY = 'WheelInteraction'

@Injectable()
export class WheelInteractionService {
    constructor(private readonly prismaService: PrismaService) {}

    async create(
        interactionId: string,
        createWheelInteractionDto: WheelInteractionDto
    ): Promise<WheelInteractionDto> {
        const allowedFields = allowedFieldsDto(
            createWheelInteractionDto,
            ENTITY
        )

        const item = await this.prismaService.wheelInteraction.create({
            data: { ...allowedFields, interactionId }
        })

        return transformWheelData(item)
    }

    async findOne(id: string): Promise<WheelInteractionDto> {
        const item = await this.prismaService.wheelInteraction.findFirst({
            where: { interactionId: id }
        })

        const validatedItem = validateExists(item, ENTITY, id)

        return transformWheelData(validatedItem)
    }

    async update(
        id: string,
        updateWheelInteractionDto: WheelInteractionDto
    ): Promise<WheelInteractionDto> {
        await this.findOne(id)

        const item = await this.prismaService.wheelInteraction.update({
            where: { interactionId: id },
            data: allowedFieldsDto(updateWheelInteractionDto, ENTITY)
        })

        return transformWheelData(item)
    }
}
