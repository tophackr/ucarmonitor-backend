import { allowedFieldsDto } from '@/common/allow-fields-dto'
import { validateExists } from '@/common/validate-entity.guard'
import { PartService } from '@/part/part.service'
import { PrismaService } from '@/prisma/prisma.service'
import { RepairService } from '@/repair/repair.service'
import { forwardRef, Inject, Injectable } from '@nestjs/common'
import { Car } from '@prisma/client'
import { CreateCarDto } from './dto/create-car.dto'
import { UpdateCarDto } from './dto/update-car.dto'

const ENTITY = 'Car'

@Injectable()
export class CarService {
    constructor(
        private readonly prismaService: PrismaService,
        @Inject(forwardRef(() => RepairService))
        private readonly repairService: RepairService,
        @Inject(forwardRef(() => PartService))
        private readonly partService: PartService
    ) {}

    private createRepairs(
        userId: string,
        carId: string
    ): Promise<{ count: number }> {
        return this.repairService.createDefault(userId, carId)
    }

    private createParts(
        userId: string,
        carId: string
    ): Promise<{ count: number }> {
        return this.partService.createDefault(userId, carId)
    }

    async create(userId: string, createCarDto: CreateCarDto): Promise<Car> {
        const items = await this.findAll(userId)

        const allowedFields = allowedFieldsDto(createCarDto, ENTITY)

        const car = await this.prismaService.car.create({
            data: { ...allowedFields, isDefault: items.length === 0, userId }
        })

        await this.createRepairs(userId, car.id)
        await this.createParts(userId, car.id)

        return car
    }

    findAll(userId: string): Promise<Car[]> {
        return this.prismaService.car.findMany({ where: { userId } })
    }

    async findOne(userId: string, id: string): Promise<Car> {
        const item = await this.prismaService.car.findFirst({
            where: { userId, id }
        })

        return validateExists(item, ENTITY, id)
    }

    private findDefaultOne(userId: string, carId: string) {
        return this.prismaService.car.findFirst({
            where: { userId, isDefault: true, NOT: { id: carId } }
        })
    }

    async update(
        userId: string,
        id: string,
        updateCarDto: UpdateCarDto
    ): Promise<Car> {
        await this.findOne(userId, id)

        const updatedItem = await this.prismaService.car.update({
            where: { userId, id },
            data: allowedFieldsDto(updateCarDto, ENTITY)
        })

        if ('isDefault' in updateCarDto && updateCarDto.isDefault === true) {
            const defaultItem = await this.findDefaultOne(userId, id)

            if (defaultItem) {
                this.update(userId, defaultItem.id, { isDefault: false })
            }
        }

        return updatedItem
    }

    async remove(userId: string, id: string): Promise<Car> {
        await this.findOne(userId, id)

        return this.prismaService.car.delete({
            where: { userId, id }
        })
    }
}
