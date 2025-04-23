import { createParamDecorator, type ExecutionContext } from '@nestjs/common'
import { User } from '@prisma/client'

export const CurrentUser = createParamDecorator(
    (data: keyof User, ctx: ExecutionContext) => {
        const request = ctx.switchToHttp().getRequest()
        const user = request.user
        user['id'] = String(user['id'])

        return data ? user[data] : user
    }
)
