import { CarService } from '@/car/car.service'
import { allowedFieldsDto } from '@/common/allow-fields-dto'
import { validateExists } from '@/common/validate-entity.guard'
import { CreatePartDto } from '@/part/dto/create-part.dto'
import { PrismaService } from '@/prisma/prisma.service'
import { BadRequestException, Injectable } from '@nestjs/common'
import { Interaction, InteractionCategory } from '@prisma/client'
import { CreateInteractionDto } from './dto/create-interaction.dto'
import { FuelInteractionDto } from './dto/fuel-interaction.dto'
import { PartInteractionDto } from './dto/part-interaction.dto'
import { RepairInteractionDto } from './dto/repair-interaction.dto'
import { UpdateInteractionDto } from './dto/update-interaction.dto'
import { WheelInteractionDto } from './dto/wheel-interaction.dto'
import { FuelInteractionService } from './fuel-interaction.service'
import { PartInteractionService } from './part-interaction.service'
import { RepairInteractionService } from './repair-interaction.service'
import { WheelInteractionService } from './wheel-interaction.service'

const ENTITY = 'Interaction'

type ISlicedInteraction =
    | FuelInteractionDto
    | RepairInteractionDto
    | CreatePartDto
    | WheelInteractionDto
type IInteraction = Interaction & {
    data: ISlicedInteraction
}

@Injectable()
export class InteractionService {
    constructor(
        private readonly prismaService: PrismaService,
        private readonly carService: CarService,
        private readonly fuelInteractionService: FuelInteractionService,
        private readonly repairInteractionService: RepairInteractionService,
        private readonly partInteractionService: PartInteractionService,
        private readonly wheelInteractionService: WheelInteractionService
    ) {}

    async create(
        userId: string,
        carId: string,
        createInteractionDto: CreateInteractionDto
    ): Promise<IInteraction> {
        await this.carService.findOne(userId, carId)

        const allowedFields = allowedFieldsDto(createInteractionDto, ENTITY)

        const item = await this.prismaService.interaction.create({
            data: { ...allowedFields, userId, carId }
        })

        let data: ISlicedInteraction

        if (createInteractionDto.type === InteractionCategory.fuel) {
            data = await this.fuelInteractionService.create(
                item.id,
                createInteractionDto.data as FuelInteractionDto
            )
        } else if (createInteractionDto.type === InteractionCategory.repair) {
            data = await this.repairInteractionService.createOrUpdate(
                userId,
                carId,
                item.id,
                createInteractionDto.data as RepairInteractionDto
            )
        } else if (createInteractionDto.type === InteractionCategory.part) {
            data = await this.partInteractionService.createOrUpdate(
                userId,
                carId,
                item.id,
                createInteractionDto.data as PartInteractionDto
            )
        } else if (
            createInteractionDto.type === InteractionCategory.purchase_wheels
        ) {
            data = await this.wheelInteractionService.create(
                item.id,
                createInteractionDto.data as WheelInteractionDto
            )
        }

        return { ...item, data }
    }

    async findAll(userId: string, carId: string): Promise<Interaction[]> {
        await this.carService.findOne(userId, carId)

        return this.prismaService.interaction.findMany({
            where: { userId, carId }
        })
    }

    async findOne(
        userId: string,
        carId: string,
        id: string
    ): Promise<IInteraction> {
        await this.carService.findOne(userId, carId)

        const item = await this.prismaService.interaction.findFirst({
            where: { userId, carId, id }
        })

        const validatedItem = validateExists(item, ENTITY, id)

        let data: ISlicedInteraction

        if (validatedItem.type === InteractionCategory.fuel) {
            data = await this.fuelInteractionService.findOne(item.id)
        } else if (validatedItem.type === InteractionCategory.repair) {
            data = await this.repairInteractionService.findAll(item.id)
        } else if (validatedItem.type === InteractionCategory.part) {
            data = await this.partInteractionService.findAll(item.id)
        } else if (validatedItem.type === InteractionCategory.purchase_wheels) {
            data = await this.wheelInteractionService.findOne(item.id)
        }

        return { ...validatedItem, data }
    }

    async update(
        userId: string,
        carId: string,
        id: string,
        updateInteractionDto: UpdateInteractionDto
    ): Promise<IInteraction> {
        await this.carService.findOne(userId, carId)
        const item = await this.findOne(userId, carId, id)

        if (
            'type' in updateInteractionDto &&
            updateInteractionDto.type !== item.type
        ) {
            throw new BadRequestException('You cannot change the item type.')
        }

        const updatedItem = await this.prismaService.interaction.update({
            where: { userId, carId, id },
            data: allowedFieldsDto(updateInteractionDto, ENTITY)
        })

        let data: ISlicedInteraction

        if (updatedItem.type === InteractionCategory.fuel) {
            data = await this.fuelInteractionService.update(
                updatedItem.id,
                updateInteractionDto.data as FuelInteractionDto
            )
        } else if (updatedItem.type === InteractionCategory.repair) {
            data = await this.repairInteractionService.createOrUpdate(
                userId,
                carId,
                item.id,
                updateInteractionDto.data as RepairInteractionDto
            )
        } else if (updatedItem.type === InteractionCategory.part) {
            data = await this.partInteractionService.createOrUpdate(
                userId,
                carId,
                item.id,
                updateInteractionDto.data as PartInteractionDto
            )
        } else if (updatedItem.type === InteractionCategory.purchase_wheels) {
            data = await this.wheelInteractionService.update(
                updatedItem.id,
                updateInteractionDto.data as WheelInteractionDto
            )
        }

        return { ...updatedItem, data }
    }

    async remove(
        userId: string,
        carId: string,
        id: string
    ): Promise<Interaction> {
        await this.carService.findOne(userId, carId)
        await this.findOne(userId, carId, id)

        return this.prismaService.interaction.delete({
            where: { userId, carId, id }
        })
    }
}
