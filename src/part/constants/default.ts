import { Part, PartOption } from '@prisma/client'

type IPart = Pick<Part, 'option' | 'isDefault' | 'isVisible'>

export const defaultPart: IPart[] = Object.values(PartOption).map(part => ({
    option: part,
    isDefault: true,
    isVisible: true
}))
