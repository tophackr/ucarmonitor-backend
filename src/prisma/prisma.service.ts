import { Injectable, OnModuleInit } from '@nestjs/common'
import { PrismaClient } from '@prisma/client'
import { withAccelerate } from '@prisma/extension-accelerate'
import { useSupabaseRowLevelSecurity } from './useSupabaseRowLevelSecurity'

@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit {
    async onModuleInit() {
        this.$extends(withAccelerate())
        this.$extends(useSupabaseRowLevelSecurity())
        await this.$connect()
    }
}
