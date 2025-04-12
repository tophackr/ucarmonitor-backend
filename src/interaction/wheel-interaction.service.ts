import { allowedFieldsDto } from '@/common/allow-fields-dto'
import { validateExists } from '@/common/validate-entity.guard'
import { PrismaService } from '@/prisma/prisma.service'
import { Injectable } from '@nestjs/common'
import { WheelInteraction } from '@prisma/client'
import { WheelInteractionDto } from './dto/wheel-interaction.dto'

const ENTITY = 'WheelInteraction'

@Injectable()
export class WheelInteractionService {
    constructor(private readonly prismaService: PrismaService) {}

    private removeUnusedProps(item: WheelInteraction): WheelInteractionDto {
        const {
            wheelType,
            tireType,
            rimType,
            brand,
            model,
            width,
            height,
            diameter
        } = item

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

        return this.removeUnusedProps(item)
    }

    async findOne(id: string): Promise<WheelInteractionDto> {
        const item = await this.prismaService.wheelInteraction.findFirst({
            where: { interactionId: id }
        })

        const validatedItem = validateExists(item, ENTITY, id)

        return this.removeUnusedProps(validatedItem)
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

        return this.removeUnusedProps(item)
    }
}
