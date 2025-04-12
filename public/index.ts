import { ValidationPipe } from '@nestjs/common'
import { NestFactory } from '@nestjs/core'
import { ExpressAdapter } from '@nestjs/platform-express'
import cookieParser from 'cookie-parser'
import express from 'express'
import morgan from 'morgan'
import serverless, { Handler } from 'serverless-http'
import { AppModule } from '../src/app.module'
import { TelegramGuard } from '../src/auth/guards/telegram.guard'

const app = express()

const bootstrap = async () => {
    const nestApp = await NestFactory.create(AppModule, new ExpressAdapter(app))

    nestApp.setGlobalPrefix('api')
    nestApp.useGlobalGuards(new TelegramGuard())
    nestApp.useGlobalPipes(new ValidationPipe())
    nestApp.use(cookieParser())
    nestApp.use(morgan('tiny'))
    nestApp.enableCors({
        origin: ['https://localhost:3000', 'https://127.0.0.1:3000'],
        credentials: true,
        exposedHeaders: 'set-cookie'
    })

    await nestApp.init()
}

bootstrap()

export const handler: Handler = serverless(app)
