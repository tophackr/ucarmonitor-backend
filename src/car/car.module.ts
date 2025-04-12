import { forwardRef, Module } from '@nestjs/common'
import { PartModule } from '../part/part.module'
import { PrismaService } from '../prisma/prisma.service'
import { RepairModule } from '../repair/repair.module'
import { CarController } from './car.controller'
import { CarService } from './car.service'

@Module({
    controllers: [CarController],
    providers: [CarService, PrismaService],
    imports: [forwardRef(() => RepairModule), forwardRef(() => PartModule)],
    exports: [CarService]
})
export class CarModule {}
