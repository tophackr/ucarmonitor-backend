import { CurrentUser } from '@/auth/decorators/user.decorator'
import {
    Body,
    Controller,
    Delete,
    Get,
    Param,
    Patch,
    Post
} from '@nestjs/common'
import { CreateRepairDto } from './dto/create-repair.dto'
import { UpdateManyRepairDto } from './dto/update-many-repair.dto'
import { UpdateRepairDto } from './dto/update-repair.dto'
import { RepairService } from './repair.service'

@Controller('car/:carId/repair')
export class RepairController {
    constructor(private readonly repairService: RepairService) {}

    @Post()
    create(
        @CurrentUser('id') userId: string,
        @Param('carId') carId: string,
        @Body() createRepairDto: CreateRepairDto
    ) {
        return this.repairService.create(userId, carId, createRepairDto)
    }

    @Get()
    findAll(@CurrentUser('id') userId: string, @Param('carId') carId: string) {
        return this.repairService.findAll(userId, carId)
    }

    @Get(':id')
    findOne(
        @CurrentUser('id') userId: string,
        @Param('carId') carId: string,
        @Param('id') id: string
    ) {
        return this.repairService.findOne(userId, carId, id)
    }

    @Patch(':id')
    update(
        @CurrentUser('id') userId: string,
        @Param('carId') carId: string,
        @Param('id') id: string,
        @Body() updateRepairDto: UpdateRepairDto
    ) {
        return this.repairService.update(userId, carId, id, updateRepairDto)
    }

    @Patch()
    updateMany(
        @CurrentUser('id') userId: string,
        @Param('carId') carId: string,
        @Body() updateManyRepairDto: UpdateManyRepairDto
    ) {
        return this.repairService.updateMany(userId, carId, updateManyRepairDto)
    }

    @Delete(':id')
    remove(
        @CurrentUser('id') userId: string,
        @Param('carId') carId: string,
        @Param('id') id: string
    ) {
        return this.repairService.remove(userId, carId, id)
    }
}
