import { Prisma } from '@prisma/client'

class EntityNotFoundException extends Error {
    constructor(entity: string) {
        super(`Entity "${entity}" not found in Prisma schema`)
        this.name = 'EntityNotFoundException'
    }
}

export function allowedFieldsDto<T>(dto: T, entity: string): T {
    const model = Prisma.dmmf.datamodel.models.find(m => m.name === entity)

    if (!model) {
        throw new EntityNotFoundException(entity)
    }

    const allowedFields = new Set(model?.fields.map(field => field.name))

    return Object.fromEntries(
        Object.entries(dto).filter(([key]) => allowedFields.has(key))
    ) as T
}
