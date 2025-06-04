import { Module, NestModule, MiddlewareConsumer } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import { RoomModule } from './modules/room/room.module'
import { Room } from './repository/room.entity'
import { Reservation } from './repository/reservation.entity'
import { ReservationModule } from './modules/reservation/reservation.module'
import { env } from './config/env.config'
import { AuthMiddleware } from './middleware/auth.middleware'
import { RoomTax } from './repository/room-tax.entity'

@Module({
    imports: [
        TypeOrmModule.forRoot({
            type: 'mysql',
            host: env.DB_HOST,
            port: env.DB_PORT,
            username: env.DB_USER,
            password: env.DB_PASSWORD,
            database: env.DB_DATABASE,
            entities: [Room, Reservation, RoomTax],
            synchronize: true,
        }),
        RoomModule,
        ReservationModule,
    ],
})
export class AppModule implements NestModule {
    configure(consumer: MiddlewareConsumer) {
        consumer.apply(AuthMiddleware).forRoutes('*')
    }
}
