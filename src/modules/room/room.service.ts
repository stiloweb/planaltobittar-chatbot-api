import { Injectable, NotFoundException } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Between, Repository } from 'typeorm'
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

        console.log('\n=== DEBUG INFO ===')
        console.log('Date range:', {
            startDate: startDate.toISOString(),
            endDate: endDate.toISOString(),
        })

        const rooms = await this.roomRepository.find()
        console.log('\nRooms found:', rooms.length)

        const roomsWithTaxes = await Promise.all(
            rooms.map(async (room) => {
                console.log(`\nProcessing room ${room.qrtId}:`)

                // Usar query SQL direta para garantir o formato correto das datas
                const roomTaxes = await this.roomTaxRepository.query(
                    `
                SELECT * FROM rlc_quarto_tarifa 
                WHERE qtrQuarto = ? 
                AND DATE(qtrData) BETWEEN DATE(?) AND DATE(?)
                ORDER BY qtrData ASC
            `,
                    [room.qrtId, startDate, endDate],
                )

                console.log(`Raw SQL query for room ${room.qrtId}:`, JSON.stringify(roomTaxes, null, 2))

                const totalTarifas = roomTaxes.reduce((sum, tax) => {
                    const taxValue = Number(tax.qtrValor)
                    console.log(`Adding tax value: ${taxValue} (${typeof taxValue}) to sum: ${sum}`)
                    return sum + taxValue
                }, 0)

                console.log(`Total tax value for room ${room.qrtId}: ${totalTarifas}`)

                return {
                    ...room,
                    totalTarifas,
                    tarifas: roomTaxes,
                }
            }),
        )

        console.log('\nFinal result:', JSON.stringify(roomsWithTaxes, null, 2))
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
