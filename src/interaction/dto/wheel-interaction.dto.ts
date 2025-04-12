import { RimType, TireType, WheelType } from '@prisma/client'
import { Transform } from 'class-transformer'
import { IsEnum, IsOptional, IsString } from 'class-validator'
import { IsWheelTypeValid } from '../validators/WheelConditionalValidator'

export class WheelInteractionDto {
    @IsEnum(WheelType)
    @Transform(({ value }) => ('' + value).toLowerCase())
    readonly wheelType: WheelType

    @IsEnum(TireType)
    @IsOptional()
    @Transform(({ value }) => ('' + value).toLowerCase())
    readonly tireType?: TireType

    @IsEnum(RimType)
    @IsOptional()
    @Transform(({ value }) => ('' + value).toLowerCase())
    readonly rimType?: RimType

    @IsString()
    @IsOptional()
    readonly brand?: string

    @IsString()
    @IsOptional()
    readonly model?: string

    @IsString()
    @IsOptional()
    readonly width?: string

    @IsString()
    @IsOptional()
    readonly height?: string

    @IsString()
    @IsOptional()
    readonly diameter?: string

    @IsWheelTypeValid()
    // @ts-expect-error TS6133: injected by framework
    private readonly _validateWheelType?: any
}
