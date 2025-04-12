import { IsBoolean, IsNumber, IsOptional, IsString } from 'class-validator'

export class CreateRepairDto {
    @IsString()
    readonly option: string

    @IsNumber()
    @IsOptional()
    readonly mileage?: number

    @IsNumber()
    @IsOptional()
    readonly days?: number

    @IsBoolean()
    @IsOptional()
    readonly isVisible?: boolean
}
