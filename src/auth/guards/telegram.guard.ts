import { AuthGuard } from '@nestjs/passport'

export class TelegramGuard extends AuthGuard('telegram') {}
