import { PartialType } from '@nestjs/mapped-types'
import { FuelInteractionDto } from './fuel-interaction.dto'

export class UpdateFuelInteractionDto extends PartialType(FuelInteractionDto) {}
