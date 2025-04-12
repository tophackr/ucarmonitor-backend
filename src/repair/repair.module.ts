import { CarModule } from '@/car/car.module'
import { PrismaService } from '@/prisma/prisma.service'
import { forwardRef, Module } from '@nestjs/common'
import { RepairController } from './repair.controller'
import { RepairService } from './repair.service'

@Module({
    controllers: [RepairController],
    providers: [RepairService, PrismaService],
    imports: [forwardRef(() => CarModule)],
    exports: [RepairService]
})
export class RepairModule {}
