import { Injectable, NestMiddleware } from '@nestjs/common'
import { Request, Response, NextFunction } from 'express'

@Injectable()
export class AuthMiddleware implements NestMiddleware {
    // TODO: Replace with a real token
    private readonly FIXED_TOKEN = '123'

    use(req: Request, res: Response, next: NextFunction) {
        const token = req.headers.authorization?.split(' ')[1]

        if (!token) {
            return res.status(401).json({
                statusCode: 401,
                message: 'No token provided',
            })
        }

        if (token !== this.FIXED_TOKEN) {
            return res.status(401).json({
                statusCode: 401,
                message: 'Invalid token',
            })
        }

        next()
    }
}
