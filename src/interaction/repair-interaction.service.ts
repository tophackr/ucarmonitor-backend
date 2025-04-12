import { BadRequestException, Injectable } from '@nestjs/common'
import { PrismaService } from '../prisma/prisma.service'
import { RepairService } from '../repair/repair.service'
import { RepairInteractionDto } from './dto/repair-interaction.dto'

@Injectable()
export class RepairInteractionService {
    constructor(
        private readonly prismaService: PrismaService,
        private readonly repairService: RepairService
    ) {}

    async createOrUpdate(
        userId: string,
        carId: string,
        id: string,
        createOrUpdateRepairInteractionDto: RepairInteractionDto
    ): Promise<RepairInteractionDto> {
        const { ids: repairIds } = await this.findAll(id)
        const ids = createOrUpdateRepairInteractionDto?.ids ?? repairIds
        const allRepairIds = (
            await this.repairService.findAll(userId, carId)
        ).map(repair => repair.id)

        const invalidIds = ids.filter(id => !allRepairIds.includes(id))

        if (invalidIds.length > 0) {
            throw new BadRequestException(
                `The following repair IDs do not exist: '${invalidIds.join(
                    "', '"
                )}'`
            )
        }

        const removeIds = repairIds.filter(repairId => !ids.includes(repairId))
        const addIds = ids.filter(repairId => !repairIds.includes(repairId))

        await this.remove(id, removeIds)
        await this.create(id, addIds)

        return this.findAll(id)
    }

    private async create(id: string, ids: string[]): Promise<void> {
        if (ids.length > 0) {
            const repairOnInteractionsData = ids.map(repairId => ({
                interactionId: id,
                repairId
            }))

            await this.prismaService.repairOnInteraction.createMany({
                data: repairOnInteractionsData
            })
        }
    }

    async findAll(id: string): Promise<RepairInteractionDto> {
        const items = await this.prismaService.repairOnInteraction.findMany({
            where: { interactionId: id }
        })

        return { ids: items.map(item => item.repairId) }
    }

    private async remove(id: string, ids: string[]): Promise<void> {
        if (ids.length > 0) {
            await this.prismaService.repairOnInteraction.deleteMany({
                where: { interactionId: id, repairId: { in: ids } }
            })
        }
    }
}
