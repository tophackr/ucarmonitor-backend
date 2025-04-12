import { IsArray, IsString } from 'class-validator'

export class RepairInteractionDto {
    @IsArray()
    @IsString({ each: true })
    readonly ids: string[]
}
