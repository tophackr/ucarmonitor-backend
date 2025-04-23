import { Injectable, UnauthorizedException } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { PassportStrategy } from '@nestjs/passport'
import { parse, User, validate } from '@telegram-apps/init-data-node'
import { Request } from 'express'
import { Strategy } from 'passport-custom'

@Injectable()
export class TelegramStrategy extends PassportStrategy(Strategy, 'telegram') {
    constructor(private readonly configService: ConfigService) {
        super()
    }

    private validateInitData(initData: string): User {
        try {
            validate(initData, this.configService.get('TELEGRAM_TOKEN'), {
                expiresIn: 3600
            })
        } catch (e) {
            console.error(e)
            return null
        }

        const { user } = parse(initData)

        return user
    }

    async validate(request: Request): Promise<User> {
        const initData = request.headers['x-telegram-data'] as string

        if (!initData) {
            throw new UnauthorizedException('Missing Telegram WebApp data')
        }

        // todo: remove after end dev mode
        const isDev = this.configService.get('NODE_ENV') === 'development'

        if (isDev && initData.includes('start_param=debug')) {
            return {
                id: 123,
                username: 'example',
                first_name: 'example'
            }
        }

        const userData = this.validateInitData(initData)

        if (!userData) {
            throw new UnauthorizedException('Invalid Telegram WebApp data')
        }

        return userData
    }
}
