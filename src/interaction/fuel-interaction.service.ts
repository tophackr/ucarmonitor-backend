import { allowedFieldsDto } from '@/common/allow-fields-dto'
import { validateExists } from '@/common/validate-entity.guard'
import { PrismaService } from '@/prisma/prisma.service'
import { Injectable } from '@nestjs/common'
import { FuelInteractionDto } from './dto/fuel-interaction.dto'
import { UpdateFuelInteractionDto } from './dto/update-fuel-interaction.dto'
import { transformFuelData } from './utils/transformFuelData'

const ENTITY = 'FuelInteraction'

@Injectable()
export class FuelInteractionService {
    constructor(private readonly prismaService: PrismaService) {}

    async create(
        interactionId: string,
        createFuelInteractionDto: FuelInteractionDto
    ): Promise<FuelInteractionDto> {
        const allowedFields = allowedFieldsDto(createFuelInteractionDto, ENTITY)

        const item = await this.prismaService.fuelInteraction.create({
            data: { ...allowedFields, interactionId }
        })

        return transformFuelData(item)
    }

    async findOne(id: string): Promise<FuelInteractionDto> {
        const item = await this.prismaService.fuelInteraction.findFirst({
            where: { interactionId: id }
        })

        const validatedItem = validateExists(item, ENTITY, id)

        return transformFuelData(validatedItem)
    }

    async update(
        id: string,
        updateFuelInteractionDto: UpdateFuelInteractionDto = {}
    ): Promise<FuelInteractionDto> {
        await this.findOne(id)

        const item = await this.prismaService.fuelInteraction.update({
            where: { interactionId: id },
            data: allowedFieldsDto(updateFuelInteractionDto, ENTITY)
        })

        return transformFuelData(item)
    }
}
