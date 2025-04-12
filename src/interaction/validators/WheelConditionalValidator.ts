import { RimType, TireType, WheelType } from '@prisma/client'
import {
    registerDecorator,
    ValidationArguments,
    ValidationOptions
} from 'class-validator'

export function IsWheelTypeValid(validationOptions?: ValidationOptions) {
    return function (object: any, propertyName: string) {
        registerDecorator({
            name: 'IsWheelTypeValid',
            target: object.constructor,
            propertyName: propertyName,
            options: validationOptions,
            validator: {
                validate(_: any, args: ValidationArguments) {
                    const obj = args.object as any
                    if (obj.wheelType === WheelType.tire) {
                        return (
                            obj.tireType !== undefined &&
                            Object.values(TireType).includes(obj.tireType)
                        )
                    }
                    if (obj.wheelType === WheelType.rim) {
                        return (
                            obj.rimType !== undefined &&
                            Object.values(RimType).includes(obj.rimType)
                        )
                    }
                    return true
                },

                defaultMessage(args: ValidationArguments) {
                    const { wheelType } = args.object as any
                    if (wheelType === WheelType.tire) {
                        return "tireType is required when wheelType is 'tire'"
                    }
                    if (wheelType === WheelType.rim) {
                        return "rimType is required when wheelType is 'rim'"
                    }
                    return 'Invalid wheelType combination'
                }
            }
        })
    }
}
