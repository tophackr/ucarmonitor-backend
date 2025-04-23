import { FuelType, OdometerUnits } from '@prisma/client'
import { Transform } from 'class-transformer'
import { IsBoolean, IsEnum, IsInt, IsOptional, IsString } from 'class-validator'

export class CreateCarDto {
    @IsBoolean()
    @IsOptional()
    readonly isDefault?: boolean

    @IsString()
    readonly brand: string

    @IsString()
    @IsOptional()
    readonly model?: string

    @IsString()
    @IsOptional()
    readonly name?: string

    @IsInt()
    @IsOptional()
    readonly year?: number

    @IsEnum(FuelType)
    @Transform(({ value }) => ('' + value).toLowerCase())
    readonly fuelType: FuelType

    @IsInt()
    @IsOptional()
    readonly fuelCapacity?: number

    @IsInt()
    readonly mileage: number

    @IsEnum(OdometerUnits)
    @Transform(({ value }) => ('' + value).toLowerCase())
    readonly odometerUnits: OdometerUnits

    @IsBoolean()
    @IsOptional()
    readonly engineHoursEnabled: boolean

    @IsInt()
    @IsOptional()
    readonly engineHours?: number
}
