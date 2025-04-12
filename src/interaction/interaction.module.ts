import { forwardRef, Module } from '@nestjs/common'
import { CarModule } from '../car/car.module'
import { PartModule } from '../part/part.module'
import { PrismaService } from '../prisma/prisma.service'
import { RepairModule } from '../repair/repair.module'
import { FuelInteractionService } from './fuel-interaction.service'
import { InteractionController } from './interaction.controller'
import { InteractionService } from './interaction.service'
import { PartInteractionService } from './part-interaction.service'
import { RepairInteractionService } from './repair-interaction.service'
import { WheelInteractionService } from './wheel-interaction.service'

@Module({
    controllers: [InteractionController],
    providers: [
        InteractionService,
        FuelInteractionService,
        RepairInteractionService,
        PartInteractionService,
        WheelInteractionService,
        PrismaService
    ],
    imports: [
        forwardRef(() => CarModule),
        forwardRef(() => RepairModule),
        forwardRef(() => PartModule)
    ]
})
export class InteractionModule {}
