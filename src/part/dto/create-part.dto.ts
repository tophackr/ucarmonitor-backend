import { IsBoolean, IsOptional, IsString } from 'class-validator'

export class CreatePartDto {
    @IsString()
    readonly option: string

    @IsBoolean()
    @IsOptional()
    readonly isVisible?: boolean
}
