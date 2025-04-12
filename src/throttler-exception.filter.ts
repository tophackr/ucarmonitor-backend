import {
    ArgumentsHost,
    Catch,
    ExceptionFilter,
    HttpStatus
} from '@nestjs/common'
import { ThrottlerException } from '@nestjs/throttler'

@Catch(ThrottlerException)
export class ThrottlerExceptionFilter implements ExceptionFilter {
    catch(_: ThrottlerException, host: ArgumentsHost) {
        const ctx = host.switchToHttp()
        const response = ctx.getResponse()
        const request = ctx.getRequest()

        const retryAfterHeader = response.getHeader('Retry-After')
        const remainingTime = retryAfterHeader
            ? parseInt(retryAfterHeader as string, 10)
            : 0

        response.status(HttpStatus.TOO_MANY_REQUESTS).json({
            message: 'Too many requests. Please try again later.',
            error: 'Too Many Requests',
            statusCode: HttpStatus.TOO_MANY_REQUESTS,
            path: request.url,
            remainingTime
        })
    }
}
