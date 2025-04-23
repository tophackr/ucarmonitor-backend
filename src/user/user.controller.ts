import { CurrentUser } from '@/auth/decorators/user.decorator'
import { Body, Controller, Get, Patch } from '@nestjs/common'
import { UpdateUserDto } from './dto/update-user.dto'
import { UserService } from './user.service'

@Controller('user/@me')
export class UserController {
    constructor(private readonly userService: UserService) {}

    @Get()
    async findOne(@CurrentUser('id') userId: string) {
        return this.userService.findOne(userId)
    }

    @Patch()
    async update(
        @CurrentUser('id') userId: string,
        @Body() updateDto: UpdateUserDto
    ) {
        return this.userService.update(userId, updateDto)
    }
}
