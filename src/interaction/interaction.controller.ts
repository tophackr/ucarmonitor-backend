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
import { CreateInteractionDto } from './dto/create-interaction.dto'
import { UpdateInteractionDto } from './dto/update-interaction.dto'
import { InteractionService } from './interaction.service'

@Controller('car/:carId/interaction')
export class InteractionController {
    constructor(private readonly interactionService: InteractionService) {}

    @Post()
    create(
        @CurrentUser('id') userId: string,
        @Param('carId') carId: string,
        @Body() createInteractionDto: CreateInteractionDto
    ) {
        return this.interactionService.create(
            userId,
            carId,
            createInteractionDto
        )
    }

    @Get()
    findAll(@CurrentUser('id') userId: string, @Param('carId') carId: string) {
        return this.interactionService.findAll(userId, carId)
    }

    @Get(':id')
    findOne(
        @CurrentUser('id') userId: string,
        @Param('carId') carId: string,
        @Param('id') id: string
    ) {
        return this.interactionService.findOne(userId, carId, id)
    }

    @Patch(':id')
    update(
        @CurrentUser('id') userId: string,
        @Param('carId') carId: string,
        @Param('id') id: string,
        @Body() updateInteractionDto: UpdateInteractionDto
    ) {
        return this.interactionService.update(
            userId,
            carId,
            id,
            updateInteractionDto
        )
    }

    @Delete(':id')
    remove(
        @CurrentUser('id') userId: string,
        @Param('carId') carId: string,
        @Param('id') id: string
    ) {
        return this.interactionService.remove(userId, carId, id)
    }
}
