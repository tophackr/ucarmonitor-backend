import { allowedFieldsDto } from '@/common/allow-fields-dto'
import { validateExists } from '@/common/validate-entity.guard'
import { PrismaService } from '@/prisma/prisma.service'
import { Injectable } from '@nestjs/common'
import { FuelInteraction } from '@prisma/client'
import { FuelInteractionDto } from './dto/fuel-interaction.dto'
import { UpdateFuelInteractionDto } from './dto/update-fuel-interaction.dto'

const ENTITY = 'FuelInteraction'

@Injectable()
export class FuelInteractionService {
    constructor(private readonly prismaService: PrismaService) {}

    private removeUnusedProps(item: FuelInteraction): FuelInteractionDto {
        const {
            fuelGrade,
            capacity,
            price,
            beforeRefueling,
            afterRefueling,
            capacityFull
        } = item

        return {
            fuelGrade,
            capacity,
            price,
            beforeRefueling,
            afterRefueling,
            capacityFull
        }
    }

    async create(
        interactionId: string,
        createFuelInteractionDto: FuelInteractionDto
    ): Promise<FuelInteractionDto> {
        const allowedFields = allowedFieldsDto(createFuelInteractionDto, ENTITY)

        const item = await this.prismaService.fuelInteraction.create({
            data: { ...allowedFields, interactionId }
        })

        return this.removeUnusedProps(item)
    }

    async findOne(id: string): Promise<FuelInteractionDto> {
        const item = await this.prismaService.fuelInteraction.findFirst({
            where: { interactionId: id }
        })

        const validatedItem = validateExists(item, ENTITY, id)

        return this.removeUnusedProps(validatedItem)
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

        return this.removeUnusedProps(item)
    }
}
