import { Module } from '@nestjs/common'
import { ConfigModule } from '@nestjs/config'
import { APP_FILTER, APP_GUARD } from '@nestjs/core'
import { ThrottlerGuard, ThrottlerModule } from '@nestjs/throttler'
import { AuthModule } from './auth/auth.module'
import { CarModule } from './car/car.module'
import { ThrottlerExceptionFilter } from './common/throttler-exception.filter'
import { InteractionModule } from './interaction/interaction.module'
import { PartModule } from './part/part.module'
import { RepairModule } from './repair/repair.module'
import { UserModule } from './user/user.module'

@Module({
    imports: [
        ThrottlerModule.forRoot([
            {
                ttl: 60000,
                limit: 10
            }
        ]),
        ConfigModule.forRoot(),
        AuthModule,
        UserModule,
        CarModule,
        RepairModule,
        PartModule,
        InteractionModule
    ],
    providers: [
        {
            provide: APP_GUARD,
            useClass: ThrottlerGuard
        },
        {
            provide: APP_FILTER,
            useClass: ThrottlerExceptionFilter
        }
    ]
})
export class AppModule {}
