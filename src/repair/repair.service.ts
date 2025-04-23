import { CarService } from '@/car/car.service'
import { allowedFieldsDto } from '@/common/allow-fields-dto'
import {
    validateExists,
    validateNoIsDefault,
    validateNotDefaultDelete,
    validateNotDefaultUpdate
} from '@/common/validate-entity.guard'
import { PrismaService } from '@/prisma/prisma.service'
import { forwardRef, Inject, Injectable } from '@nestjs/common'
import { Interaction, Repair } from '@prisma/client'
import { defaultRepair } from './constants/default'
import { CreateRepairDto } from './dto/create-repair.dto'
import { UpdateManyRepairDto } from './dto/update-many-repair.dto'
import { UpdateRepairDto } from './dto/update-repair.dto'

const ENTITY = 'Repair'

export interface RepairWithInteraction extends Repair {
    interaction: Interaction
}

@Injectable()
export class RepairService {
    constructor(
        private readonly prismaService: PrismaService,
        @Inject(forwardRef(() => CarService))
        private readonly carService: CarService
    ) {}

    async create(
        userId: string,
        carId: string,
        createRepairDto: CreateRepairDto
    ): Promise<Repair> {
        await this.carService.findOne(userId, carId)

        validateNoIsDefault(createRepairDto)

        const allowedFields = allowedFieldsDto(createRepairDto, ENTITY)

        return this.prismaService.repair.create({
            data: { ...allowedFields, userId, carId }
        })
    }

    createDefault(userId: string, carId: string): Promise<{ count: number }> {
        return this.prismaService.repair.createMany({
            data: defaultRepair.map(repair => ({ ...repair, userId, carId }))
        })
    }

    async findAll(
        userId: string,
        carId: string
    ): Promise<RepairWithInteraction[]> {
        await this.carService.findOne(userId, carId)

        const items = await this.prismaService.repair.findMany({
            where: { userId, carId },
            include: {
                interactions: {
                    include: {
                        interaction: true
                    },
                    orderBy: {
                        interaction: {
                            date: 'desc'
                        }
                    },
                    take: 1
                }
            }
        })

        return items.map(item => {
            const { interactions, ...args } = item
            const interaction = interactions[0]?.interaction

            const data = {
                ...args,
                interaction: interaction ?? null
            }

            return data
        })
    }

    async findOne(userId: string, carId: string, id: string): Promise<Repair> {
        await this.carService.findOne(userId, carId)

        const item = await this.prismaService.repair.findFirst({
            where: { userId, carId, id }
        })

        return validateExists(item, ENTITY, id)
    }

    async update(
        userId: string,
        carId: string,
        id: string,
        updateRepairDto: UpdateRepairDto
    ): Promise<Repair> {
        await this.carService.findOne(userId, carId)

        validateNoIsDefault(updateRepairDto)

        const item = await this.findOne(userId, carId, id)

        validateNotDefaultUpdate(updateRepairDto, item, ENTITY)

        return this.prismaService.repair.update({
            where: { userId, carId, id },
            data: allowedFieldsDto(updateRepairDto, ENTITY)
        })
    }

    async updateMany(
        userId: string,
        carId: string,
        updateManyRepairDto: UpdateManyRepairDto
    ): Promise<Repair[]> {
        await this.carService.findOne(userId, carId)

        const updated = await Promise.all(
            updateManyRepairDto.repairs
                .map(async repair => {
                    const { id, ...data } = repair

                    validateNoIsDefault(data)

                    const item = await this.prismaService.repair.findFirst({
                        where: { userId, carId, id }
                    })

                    validateNotDefaultUpdate(data, item, ENTITY)

                    if (item) {
                        return this.prismaService.repair.update({
                            where: { id },
                            data
                        })
                    }
                })
                .filter(Boolean)
        )

        return updated
    }

    async remove(userId: string, carId: string, id: string): Promise<Repair> {
        await this.carService.findOne(userId, carId)
        const item = await this.findOne(userId, carId, id)

        validateNotDefaultDelete(item, ENTITY)

        return this.prismaService.repair.delete({
            where: { userId, carId, id }
        })
    }
}
