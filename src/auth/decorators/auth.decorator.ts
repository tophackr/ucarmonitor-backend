import { TelegramGuard } from '../guards/telegram.guard'
import { UseGuards } from '@nestjs/common'

export const Auth = () => UseGuards(TelegramGuard)
