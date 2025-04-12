import { CarModule } from '@/car/car.module'
import { PrismaService } from '@/prisma/prisma.service'
import { forwardRef, Module } from '@nestjs/common'
import { PartController } from './part.controller'
import { PartService } from './part.service'

@Module({
    controllers: [PartController],
    providers: [PartService, PrismaService],
    imports: [forwardRef(() => CarModule)],
    exports: [PartService]
})
export class PartModule {}
