import { FuelGrade } from '@prisma/client'
import { Transform } from 'class-transformer'
import { IsBoolean, IsEnum, IsNumber, IsOptional } from 'class-validator'

export class FuelInteractionDto {
    @IsEnum(FuelGrade)
    @Transform(({ value }) => ('' + value).toLowerCase())
    readonly fuelGrade: FuelGrade

    @IsNumber()
    @IsOptional()
    readonly capacity?: number

    @IsNumber()
    @IsOptional()
    readonly price?: number

    @IsNumber()
    @IsOptional()
    readonly beforeRefueling?: number

    @IsNumber()
    @IsOptional()
    readonly afterRefueling?: number

    @IsBoolean()
    @IsOptional()
    readonly capacityFull?: boolean
}
