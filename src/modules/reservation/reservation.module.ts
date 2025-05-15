import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import { ReservationController } from './reservation.controller'
import { ReservationService } from './reservation.service'
import { Reservation } from '../../repository/reservation.entity'
import { Room } from '../../repository/room.entity'

@Module({
    imports: [TypeOrmModule.forFeature([Reservation, Room])],
    controllers: [ReservationController],
    providers: [ReservationService],
})
export class ReservationModule {}
