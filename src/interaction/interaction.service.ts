import { CarService } from '@/car/car.service'
import { allowedFieldsDto } from '@/common/allow-fields-dto'
import { validateExists } from '@/common/validate-entity.guard'
import { PrismaService } from '@/prisma/prisma.service'
import { BadRequestException, Injectable } from '@nestjs/common'
import { Interaction, InteractionCategory } from '@prisma/client'
import {
    CreateInteractionDto,
    ISlicedInteraction
} from './dto/create-interaction.dto'
import { FuelInteractionDto } from './dto/fuel-interaction.dto'
import { PartInteractionDto } from './dto/part-interaction.dto'
import { RepairInteractionDto } from './dto/repair-interaction.dto'
import { UpdateInteractionDto } from './dto/update-interaction.dto'
import { WheelInteractionDto } from './dto/wheel-interaction.dto'
import { FuelInteractionService } from './fuel-interaction.service'
import { PartInteractionService } from './part-interaction.service'
import { RepairInteractionService } from './repair-interaction.service'
import { transformFuelData } from './utils/transformFuelData'
import { transformPartData } from './utils/transformPartData'
import { transformRepairData } from './utils/transformRepairData'
import { transformWheelData } from './utils/transformWheelData'
import { WheelInteractionService } from './wheel-interaction.service'

const ENTITY = 'Interaction'

type IInteraction = Interaction & {
    data: ISlicedInteraction
}

function isMaintenanceOrRepair(type: InteractionCategory): boolean {
    return (
        type === InteractionCategory.maintenance ||
        type === InteractionCategory.repair
    )
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

    private createItemData(
        userId: string,
        carId: string,
        createInteractionDto: CreateInteractionDto,
        item: Interaction
    ): Promise<ISlicedInteraction> {
        if (item.type === InteractionCategory.fuel) {
            return this.fuelInteractionService.create(
                item.id,
                createInteractionDto.data as FuelInteractionDto
            )
        } else if (isMaintenanceOrRepair(item.type)) {
            return this.repairInteractionService.createOrUpdate(
                userId,
                carId,
                item.id,
                createInteractionDto.data as RepairInteractionDto
            )
        } else if (item.type === InteractionCategory.part) {
            return this.partInteractionService.createOrUpdate(
                userId,
                carId,
                item.id,
                createInteractionDto.data as PartInteractionDto
            )
        } else if (item.type === InteractionCategory.purchase_wheels) {
            return this.wheelInteractionService.create(
                item.id,
                createInteractionDto.data as WheelInteractionDto
            )
        }
    }

    private findItemData(item: Interaction): Promise<ISlicedInteraction> {
        if (item.type === InteractionCategory.fuel) {
            return this.fuelInteractionService.findOne(item.id)
        } else if (isMaintenanceOrRepair(item.type)) {
            return this.repairInteractionService.findAll(item.id)
        } else if (item.type === InteractionCategory.part) {
            return this.partInteractionService.findAll(item.id)
        } else if (item.type === InteractionCategory.purchase_wheels) {
            return this.wheelInteractionService.findOne(item.id)
        }
    }

    private updateItemData(
        userId: string,
        carId: string,
        updateInteractionDto: UpdateInteractionDto,
        item: Interaction
    ): Promise<ISlicedInteraction> {
        if (item.type === InteractionCategory.fuel) {
            return this.fuelInteractionService.update(
                item.id,
                updateInteractionDto.data as FuelInteractionDto
            )
        } else if (isMaintenanceOrRepair(item.type)) {
            return this.repairInteractionService.createOrUpdate(
                userId,
                carId,
                item.id,
                updateInteractionDto.data as RepairInteractionDto
            )
        } else if (item.type === InteractionCategory.part) {
            return this.partInteractionService.createOrUpdate(
                userId,
                carId,
                item.id,
                updateInteractionDto.data as PartInteractionDto
            )
        } else if (item.type === InteractionCategory.purchase_wheels) {
            return this.wheelInteractionService.update(
                item.id,
                updateInteractionDto.data as WheelInteractionDto
            )
        }
    }

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

        const data = await this.createItemData(
            userId,
            carId,
            createInteractionDto,
            item
        )

        return { ...item, data }
    }

    async findAll(userId: string, carId: string): Promise<Interaction[]> {
        await this.carService.findOne(userId, carId)

        const items = await this.prismaService.interaction.findMany({
            where: { userId, carId },
            include: {
                fuelInteraction: true,
                repairInteractions: true,
                partInteractions: true,
                wheelInteraction: true
            },
            orderBy: {
                date: 'desc'
            }
        })

        return items.map(item => {
            const {
                fuelInteraction,
                repairInteractions,
                partInteractions,
                wheelInteraction,
                ...args
            } = item

            let data: ISlicedInteraction

            if (fuelInteraction) {
                data = transformFuelData(fuelInteraction)
            } else if (repairInteractions.length) {
                data = transformRepairData(repairInteractions)
            } else if (partInteractions.length) {
                data = transformPartData(partInteractions)
            } else if (wheelInteraction) {
                data = transformWheelData(wheelInteraction)
            }

            return { ...args, data }
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

        const data = await this.findItemData(validatedItem)

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

        const data = await this.updateItemData(
            userId,
            carId,
            updateInteractionDto,
            updatedItem
        )

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
