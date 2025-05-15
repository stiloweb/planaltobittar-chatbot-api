import { Injectable, NotFoundException } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository, Between, Not, In, MoreThanOrEqual } from 'typeorm'
import { Reservation } from '../../repository/reservation.entity'
import { Room } from '../../repository/room.entity'

@Injectable()
export class ReservationService {
    constructor(
        @InjectRepository(Reservation)
        private reservationRepository: Repository<Reservation>,
        @InjectRepository(Room)
        private roomRepository: Repository<Room>,
    ) {}

    async findAll(): Promise<Reservation[]> {
        return this.reservationRepository.find()
    }

    async findOne(id: number): Promise<Reservation> {
        const reservation = await this.reservationRepository.findOne({ where: { rsvId: id } })
        if (!reservation) {
            throw new NotFoundException(`Reservation with ID ${id} not found`)
        }
        return reservation
    }

    async checkAvailability(checkIn: string, checkOut: string, adults: number, children: number): Promise<Room[]> {
        const overlappingReservations = await this.reservationRepository.find({
            where: [
                {
                    rsvDataEntrada: Between(checkIn, checkOut),
                },
                {
                    rsvDataSaida: Between(checkIn, checkOut),
                },
            ],
        })

        const reservedRoomIds = overlappingReservations.map((reservation) => reservation.rsvQuartos)

        const availableRooms = await this.roomRepository.find({
            where: {
                qrtId: Not(In(reservedRoomIds)),
                qrtCapacidadeAdulto: MoreThanOrEqual(adults),
                qrtCapacidadeCrianca: MoreThanOrEqual(children),
                qrtSituacao: 'Ativo',
            },
        })

        return availableRooms
    }
}
