import { forwardRef, Inject, Injectable } from '@nestjs/common'
import { Repair } from '@prisma/client'
import { CarService } from '../car/car.service'
import { allowedFieldsDto } from '../common/allow-fields-dto'
import {
    validateExists,
    validateNoIsDefault,
    validateNotDefaultDelete,
    validateNotDefaultUpdate
} from '../common/validate-entity.guard'
import { PrismaService } from '../prisma/prisma.service'
import { defaultRepair } from './constants/default'
import { CreateRepairDto } from './dto/create-repair.dto'
import { UpdateRepairDto } from './dto/update-repair.dto'

const ENTITY = 'Repair'

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

    async findAll(userId: string, carId: string): Promise<Repair[]> {
        await this.carService.findOne(userId, carId)

        return this.prismaService.repair.findMany({
            where: { userId, carId }
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

    async remove(userId: string, carId: string, id: string): Promise<Repair> {
        await this.carService.findOne(userId, carId)
        const item = await this.findOne(userId, carId, id)

        validateNotDefaultDelete(item, ENTITY)

        return this.prismaService.repair.delete({
            where: { userId, carId, id }
        })
    }
}
