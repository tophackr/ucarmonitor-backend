import { Injectable, UnauthorizedException } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { PassportStrategy } from '@nestjs/passport'
import { InitData, parse, validate } from '@telegram-apps/init-data-node'
import { Request } from 'express'
import { Strategy } from 'passport-custom'

type InitDataResponse = Pick<InitData, 'auth_date' | 'query_id' | 'user'>

@Injectable()
export class TelegramStrategy extends PassportStrategy(Strategy, 'telegram') {
    constructor(private readonly configService: ConfigService) {
        super()
    }

    private validateInitData(initData: string): InitDataResponse | null {
        try {
            validate(initData, this.configService.get('TELEGRAM_TOKEN'), {
                expiresIn: 3600
            })
        } catch (e) {
            console.error(e)
            return null
        }

        const { auth_date, query_id, user } = parse(initData)

        return { auth_date, query_id, user }
    }

    async validate(request: Request): Promise<InitDataResponse> {
        const initData = request.headers['x-telegram-data'] as string

        if (!initData) {
            throw new UnauthorizedException('Missing Telegram WebApp data')
        }

        // todo: remove after end dev mode
        const isDev = this.configService.get('NODE_ENV') === 'development'

        if (isDev && initData.includes('start_param=debug')) {
            return {
                auth_date: new Date(),
                query_id: crypto.randomUUID(),
                user: {
                    id: 123,
                    username: 'example',
                    first_name: 'example'
                }
            }
        }

        const userData = this.validateInitData(initData)

        if (!userData) {
            throw new UnauthorizedException('Invalid Telegram WebApp data')
        }

        return userData
    }
}
