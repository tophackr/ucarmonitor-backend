import { allowedFieldsDto } from '@/common/allow-fields-dto'
import { validateExists } from '@/common/validate-entity.guard'
import { Injectable } from '@nestjs/common'
import { User } from '@prisma/client'
import { PrismaService } from '../prisma/prisma.service'
import { UserDto } from './dto/user.dto'

const ENTITY = 'User'

@Injectable()
export class UserService {
    constructor(private readonly prismaService: PrismaService) {}

    createOrUpdate(id: string, createOrUpdateDto: UserDto): Promise<User> {
        const allowedFields = allowedFieldsDto(createOrUpdateDto, ENTITY)

        return this.prismaService.user.upsert({
            where: { id: id },
            update: allowedFields,
            create: {
                ...allowedFields,
                id
            }
        })
    }

    async findOne(id: string): Promise<User> {
        const item = await this.prismaService.user.findUnique({
            where: { id }
        })

        return validateExists(item, ENTITY, id)
    }
}
