import { IsBoolean, IsInt, IsOptional, IsString } from 'class-validator'

export class CreateRepairDto {
    @IsString()
    readonly option: string

    @IsInt()
    @IsOptional()
    readonly mileage?: number

    @IsInt()
    @IsOptional()
    readonly days?: number

    @IsBoolean()
    @IsOptional()
    readonly isVisible?: boolean
}
