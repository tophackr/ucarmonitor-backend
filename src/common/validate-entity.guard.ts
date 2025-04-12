import {
    BadRequestException,
    ForbiddenException,
    NotFoundException
} from '@nestjs/common'

interface Entity {
    isDefault: boolean
}

/**
 * Бросает 400, если DTO содержит поле isDefault
 */
export function validateNoIsDefault(dto: object): void {
    if ('isDefault' in dto) {
        throw new BadRequestException(
            'You cannot set or change the default value.'
        )
    }
}

/**
 * Бросает 404, если item отсутствует
 */
export function validateExists<T>(
    item: T | null | undefined,
    entity: string,
    id: string
): T {
    if (!item) {
        throw new NotFoundException(`${entity} with ID '${id}' not found.`)
    }

    return item
}

/**
 * Бросает 403, если пытаемся изменить default-объект
 */
export function validateNotDefaultUpdate<T extends Entity>(
    dto: object,
    item: T,
    entity: string,
    forbiddenField = 'option'
): void {
    if (forbiddenField in dto && item.isDefault) {
        throw new ForbiddenException(
            `You cannot update the default ${entity} item name.`
        )
    }
}

/**
 * Бросает 403, если пытаемся удалить default-объект
 */
export function validateNotDefaultDelete<T extends Entity>(
    item: T,
    entity: string
): void {
    if (item.isDefault) {
        throw new ForbiddenException(
            `You cannot delete the ${entity} item by default.`
        )
    }
}
