import { ValidationPipe } from '@nestjs/common'
import { NestFactory } from '@nestjs/core'
import morgan from 'morgan'
import process from 'node:process'
import { AppModule } from './app.module'
import { TelegramGuard } from './auth/guards/telegram.guard'

async function bootstrap() {
    const app = await NestFactory.create(AppModule)

    const isDev = process.env.NODE_ENV === 'development'

    morgan.token('time', () => new Date().toTimeString().split(' ')[0])

    app.setGlobalPrefix('api')
    app.useGlobalGuards(new TelegramGuard())
    app.useGlobalPipes(new ValidationPipe({ transform: true }))
    app.use(
        morgan(
            isDev
                ? '[:time] :method :url :status :res[content-length] - :response-time ms'
                : 'combined',
            {
                skip: (_, res) => !isDev && res.statusCode < 400
            }
        )
    )
    app.enableCors({
        origin: [
            'http://localhost:3000',
            'http://127.0.0.1:3000',
            'https://ucarmonitor.vercel.app/'
        ],
        methods: ['GET', 'POST', 'PATCH', 'DELETE', 'OPTIONS'],
        allowedHeaders: ['Content-Type', 'X-Telegram-Data'],
        credentials: true
    })

    await app.listen(process.env.PORT ?? 3000)
    console.log('sterted at port: ' + (await app.getUrl()))
}

bootstrap()
