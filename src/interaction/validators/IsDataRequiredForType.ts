/* eslint-disable @typescript-eslint/no-explicit-any */
import { InteractionCategory } from '@prisma/client'
import {
    registerDecorator,
    ValidationArguments,
    ValidationOptions
} from 'class-validator'

export function IsDataRequiredForType(validationOptions?: ValidationOptions) {
    return function (object: unknown, propertyName: string) {
        registerDecorator({
            name: 'isDataRequiredForType',
            target: object.constructor,
            propertyName: propertyName,
            options: validationOptions,
            validator: {
                validate(value: unknown, args: ValidationArguments) {
                    const obj = args.object as any
                    if (
                        [
                            InteractionCategory.fuel,
                            InteractionCategory.repair,
                            InteractionCategory.part,
                            InteractionCategory.purchase_wheels
                        ].includes(obj.type)
                    ) {
                        return typeof value === 'object' && value !== null
                    }
                    return true
                },
                defaultMessage(args: ValidationArguments) {
                    const obj = args.object as { type: InteractionCategory }
                    return `data must be an object for type ${obj.type}`
                }
            }
        })
    }
}
