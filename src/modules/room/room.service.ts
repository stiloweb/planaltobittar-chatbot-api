import { Injectable, NotFoundException } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import { Room } from '../../repository/room.entity'
import { RoomTax } from 'src/repository/room-tax.entity'

interface RoomWithTaxes extends Room {
    totalTarifas: number
    tarifas: RoomTax[]
}

@Injectable()
export class RoomService {
    constructor(
        @InjectRepository(Room)
        private roomRepository: Repository<Room>,
        @InjectRepository(RoomTax)
        private roomTaxRepository: Repository<RoomTax>,
    ) {}

    async findAll(): Promise<Room[]> {
        return this.roomRepository.find()
    }

    async findRoomTaxesByReservationDate(checkin: Date, checkout: Date): Promise<RoomWithTaxes[]> {
        const startDate = new Date(checkin)
        startDate.setHours(0, 0, 0, 0)

        const endDate = new Date(checkout)
        endDate.setHours(23, 59, 59, 999)

        const rooms = await this.roomRepository.find()

        const roomsWithTaxes = await Promise.all(
            rooms.map(async (room) => {
                const roomTaxes = await this.roomTaxRepository.query(
                    `
                SELECT * FROM rlc_quarto_tarifa 
                WHERE qtrQuarto = ? 
                AND DATE(qtrData) BETWEEN DATE(?) AND DATE(?)
                ORDER BY qtrData ASC
            `,
                    [room.qrtId, startDate, endDate],
                )

                const totalTarifas = roomTaxes.reduce((sum, tax) => {
                    const taxValue = Number(tax.qtrValor)
                    return sum + taxValue
                }, 0)

                return {
                    ...room,
                    totalTarifas,
                    tarifas: roomTaxes,
                }
            }),
        )

        return roomsWithTaxes
    }

    async findOne(id: number): Promise<Room> {
        const room = await this.roomRepository.findOne({ where: { qrtId: id } })
        if (!room) {
            throw new NotFoundException(`Room with ID ${id} not found`)
        }
        return room
    }
}
