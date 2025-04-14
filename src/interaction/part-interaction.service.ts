import { PartService } from '@/part/part.service'
import { PrismaService } from '@/prisma/prisma.service'
import { BadRequestException, Injectable } from '@nestjs/common'
import { PartInteractionDto } from './dto/part-interaction.dto'

@Injectable()
export class PartInteractionService {
    constructor(
        private readonly prismaService: PrismaService,
        private readonly partService: PartService
    ) {}

    async createOrUpdate(
        userId: string,
        carId: string,
        id: string,
        createOrUpdatePartInteractionDto: PartInteractionDto
    ): Promise<PartInteractionDto> {
        const { ids: partIds } = await this.findAll(id)
        const ids = createOrUpdatePartInteractionDto?.ids ?? partIds
        const allPartIds = (await this.partService.findAll(userId, carId)).map(
            part => part.id
        )

        const invalidIds = ids.filter(id => !allPartIds.includes(id))

        if (invalidIds.length > 0) {
            throw new BadRequestException(
                `The following part IDs do not exist: '${invalidIds.join(
                    "', '"
                )}'`
            )
        }

        const removeIds = partIds.filter(partId => !ids.includes(partId))
        const addIds = ids.filter(partId => !partIds.includes(partId))

        await this.remove(id, removeIds)
        await this.create(id, addIds)

        return this.findAll(id)
    }

    private async create(id: string, ids: string[]): Promise<void> {
        if (ids.length > 0) {
            const partOnInteractionsData = ids.map(partId => ({
                interactionId: id,
                partId
            }))

            await this.prismaService.partOnInteraction.createMany({
                data: partOnInteractionsData
            })
        }
    }

    async findAll(id: string): Promise<PartInteractionDto> {
        const items = await this.prismaService.partOnInteraction.findMany({
            where: { interactionId: id }
        })

        return { ids: items.map(item => item.partId) }
    }

    private async remove(id: string, ids: string[]): Promise<void> {
        if (ids.length > 0) {
            await this.prismaService.partOnInteraction.deleteMany({
                where: { interactionId: id, partId: { in: ids } }
            })
        }
    }
}
