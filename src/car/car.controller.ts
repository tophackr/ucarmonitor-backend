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
import { CarService } from './car.service'
import { CreateCarDto } from './dto/create-car.dto'
import { UpdateCarDto } from './dto/update-car.dto'

@Controller('car')
export class CarController {
    constructor(private readonly carService: CarService) {}

    @Post()
    create(
        @CurrentUser('id') userId: string,
        @Body() createCarDto: CreateCarDto
    ) {
        return this.carService.create(userId, createCarDto)
    }

    @Get()
    findAll(@CurrentUser('id') userId: string) {
        return this.carService.findAll(userId)
    }

    @Get(':id')
    findOne(@CurrentUser('id') userId: string, @Param('id') id: string) {
        return this.carService.findOne(userId, id)
    }

    @Patch(':id')
    update(
        @CurrentUser('id') userId: string,
        @Param('id') id: string,
        @Body() updateCarDto: UpdateCarDto
    ) {
        return this.carService.update(userId, id, updateCarDto)
    }

    @Delete(':id')
    remove(@CurrentUser('id') userId: string, @Param('id') id: string) {
        return this.carService.remove(userId, id)
    }
}
