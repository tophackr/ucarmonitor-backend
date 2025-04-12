import { Module } from '@nestjs/common'
import { PassportModule } from '@nestjs/passport'
import { TelegramStrategy } from './strategy/telegram.strategy'
import { ConfigModule } from '@nestjs/config'

@Module({
    imports: [ConfigModule, PassportModule],
    providers: [TelegramStrategy]
})
export class AuthModule {}
