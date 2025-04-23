import { RimType, TireType, WheelType } from '@prisma/client'
import { Transform } from 'class-transformer'
import { IsEnum, IsInt, IsNumber, IsOptional, IsString } from 'class-validator'
import { IsWheelTypeValid } from '../validators/WheelConditionalValidator'

export class WheelInteractionDto {
    @IsEnum(WheelType)
    @Transform(({ value }) => ('' + value).toLowerCase())
    readonly wheelType: WheelType

    @IsEnum(TireType)
    @IsOptional()
    readonly tireType?: TireType

    @IsEnum(RimType)
    @IsOptional()
    readonly rimType?: RimType

    @IsString()
    @IsOptional()
    readonly brand?: string

    @IsString()
    @IsOptional()
    readonly model?: string

    @IsNumber({ maxDecimalPlaces: 1 })
    @IsOptional()
    readonly width?: number

    @IsInt()
    @IsOptional()
    readonly height?: number

    @IsInt()
    @IsOptional()
    readonly diameter?: number

    @IsWheelTypeValid()
    // @ts-expect-error TS6133: injected by framework
    private readonly _validateWheelType?: unknown
}
