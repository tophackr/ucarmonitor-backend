import { InteractionCategory } from '@prisma/client'
import { Transform, Type } from 'class-transformer'
import {
    IsDateString,
    IsEnum,
    IsInt,
    IsNumber,
    IsOptional,
    IsString,
    ValidateNested
} from 'class-validator'
import { IsDataRequiredForType } from '../validators/IsDataRequiredForType'
import { FuelInteractionDto } from './fuel-interaction.dto'
import { PartInteractionDto } from './part-interaction.dto'
import { RepairInteractionDto } from './repair-interaction.dto'
import { WheelInteractionDto } from './wheel-interaction.dto'

export class CreateInteractionDto {
    @IsEnum(InteractionCategory)
    @Transform(({ value }) => ('' + value).toLowerCase())
    readonly type: InteractionCategory

    @IsDateString()
    readonly date: Date

    @IsInt()
    @IsOptional()
    readonly mileage?: number

    @IsNumber({ maxDecimalPlaces: 2 })
    @IsOptional()
    readonly amount?: number

    @IsInt()
    @IsOptional()
    readonly engineHours?: number

    @IsString()
    @IsOptional()
    readonly description?: string

    @IsDataRequiredForType()
    @ValidateNested()
    @Type(options => {
        const obj = options?.object as CreateInteractionDto
        switch (obj?.type) {
            case InteractionCategory.fuel:
                return FuelInteractionDto
            case InteractionCategory.repair:
                return RepairInteractionDto
            case InteractionCategory.part:
                return PartInteractionDto
            case InteractionCategory.purchase_wheels:
                return WheelInteractionDto
            default:
                return Object
        }
    })
    readonly data:
        | FuelInteractionDto
        | RepairInteractionDto
        | PartInteractionDto
        | WheelInteractionDto
}
