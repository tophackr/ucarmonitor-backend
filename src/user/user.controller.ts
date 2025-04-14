import { CurrentUser } from '@/auth/decorators/user.decorator'
import { Body, Controller, Get, Post } from '@nestjs/common'
import { UserDto } from './dto/user.dto'
import { UserService } from './user.service'

@Controller('user/@me')
export class UserController {
    constructor(private readonly userService: UserService) {}

    @Post()
    async createOrUpdate(
        @CurrentUser('id') userId: string,
        @Body() createOrUpdateDto: UserDto
    ) {
        return this.userService.createOrUpdate(userId, createOrUpdateDto)
    }

    @Get()
    async findOne(@CurrentUser('id') userId: string) {
        return this.userService.findOne(userId)
    }
}
