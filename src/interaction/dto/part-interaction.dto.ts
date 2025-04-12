import { IsArray, IsString } from 'class-validator'

export class PartInteractionDto {
    @IsArray()
    @IsString({ each: true })
    readonly ids: string[]
}
