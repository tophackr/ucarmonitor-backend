import { Language } from '@prisma/client'
import { Transform } from 'class-transformer'
import { IsEnum, IsOptional, IsString } from 'class-validator'

export class UserDto {
    @IsOptional()
    @IsEnum(Language)
    @Transform(({ value }) => ('' + value).toLowerCase())
    readonly language?: Language

    @IsOptional()
    @IsString()
    readonly timezone?: string
}
