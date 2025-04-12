import { forwardRef, Inject, Injectable } from '@nestjs/common'
import { Part } from '@prisma/client'
import { CarService } from '../car/car.service'
import { allowedFieldsDto } from '../common/allow-fields-dto'
import {
    validateExists,
    validateNoIsDefault,
    validateNotDefaultDelete,
    validateNotDefaultUpdate
} from '../common/validate-entity.guard'
import { PrismaService } from '../prisma/prisma.service'
import { defaultPart } from './constants/default'
import { CreatePartDto } from './dto/create-part.dto'
import { UpdatePartDto } from './dto/update-part.dto'

const ENTITY = 'Part'

@Injectable()
export class PartService {
    constructor(
        private readonly prismaService: PrismaService,
        @Inject(forwardRef(() => CarService))
        private readonly carService: CarService
    ) {}

    async create(
        userId: string,
        carId: string,
        createPartDto: CreatePartDto
    ): Promise<Part> {
        await this.carService.findOne(userId, carId)

        validateNoIsDefault(createPartDto)

        const allowedFields = allowedFieldsDto(createPartDto, ENTITY)

        return this.prismaService.part.create({
            data: { ...allowedFields, userId, carId }
        })
    }

    createDefault(userId: string, carId: string): Promise<{ count: number }> {
        return this.prismaService.part.createMany({
            data: defaultPart.map(part => ({ ...part, userId, carId }))
        })
    }

    async findAll(userId: string, carId: string): Promise<Part[]> {
        await this.carService.findOne(userId, carId)

        return this.prismaService.part.findMany({
            where: { userId, carId }
        })
    }

    async findOne(userId: string, carId: string, id: string): Promise<Part> {
        await this.carService.findOne(userId, carId)

        const item = await this.prismaService.part.findFirst({
            where: { userId, carId, id }
        })

        return validateExists(item, ENTITY, id)
    }

    async update(
        userId: string,
        carId: string,
        id: string,
        updatePartDto: UpdatePartDto
    ): Promise<Part> {
        await this.carService.findOne(userId, carId)

        validateNoIsDefault(updatePartDto)

        const item = await this.findOne(userId, carId, id)

        validateNotDefaultUpdate(updatePartDto, item, ENTITY)

        return this.prismaService.part.update({
            where: { userId, carId, id },
            data: allowedFieldsDto(updatePartDto, ENTITY)
        })
    }

    async remove(userId: string, carId: string, id: string): Promise<Part> {
        await this.carService.findOne(userId, carId)
        const item = await this.findOne(userId, carId, id)

        validateNotDefaultDelete(item, ENTITY)

        return this.prismaService.part.delete({
            where: { userId, carId, id }
        })
    }
}
