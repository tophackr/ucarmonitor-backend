import { ValidationPipe } from '@nestjs/common'
import { NestFactory } from '@nestjs/core'
import cookieParser from 'cookie-parser'
import morgan from 'morgan'
import process from 'node:process'
import { AppModule } from './app.module'
import { TelegramGuard } from './auth/guards/telegram.guard'

async function bootstrap() {
    const app = await NestFactory.create(AppModule)

    app.setGlobalPrefix('api')
    app.useGlobalGuards(new TelegramGuard())
    app.useGlobalPipes(new ValidationPipe())
    app.use(cookieParser())
    app.use(morgan('tiny'))
    app.enableCors({
        origin: [
            'https://localhost:3000',
            'https://127.0.0.1:3000',
            'https://ucarmonitor.vercel.app/',
            'https://tgl.mini-apps.store/?app_id=16'
        ],
        methods: ['GET,PATCH,POST,DELETE'],
        credentials: true
    })

    await app.listen(process.env.PORT ?? 3000)
    console.log('sterted at port: ' + (await app.getUrl()))
}

bootstrap()
