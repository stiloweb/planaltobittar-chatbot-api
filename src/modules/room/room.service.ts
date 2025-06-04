import { Injectable, NotFoundException } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Between, Repository } from 'typeorm'
import { Room } from '../../repository/room.entity'
import { RoomTax } from 'src/repository/room-tax.entity'

interface RoomWithTaxes extends Room {
    totalTaxValue: number
    taxes: RoomTax[]
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

        console.log('Searching for taxes between:', startDate.toISOString(), 'and', endDate.toISOString())

        const tableInfo = await this.roomTaxRepository.query(`
            SHOW TABLES LIKE 'dad_quarto_tarifa'
        `)
        console.log('Table info:', JSON.stringify(tableInfo, null, 2))

        if (tableInfo.length > 0) {
            const columns = await this.roomTaxRepository.query(`
                SHOW COLUMNS FROM dad_quarto_tarifa
            `)
            console.log('Table columns:', JSON.stringify(columns, null, 2))

            const rawTaxes = await this.roomTaxRepository.query(
                `
                SELECT * FROM dad_quarto_tarifa 
                WHERE qtrData BETWEEN ? AND ?
                ORDER BY qtrData ASC
            `,
                [startDate, endDate],
            )
            console.log('Raw SQL query result:', JSON.stringify(rawTaxes, null, 2))
        }

        const roomTaxes = await this.roomTaxRepository.find({
            where: {
                qtrData: Between(startDate, endDate),
            },
            order: {
                qtrData: 'ASC',
            },
        })

        console.log('Found taxes (TypeORM):', JSON.stringify(roomTaxes, null, 2))

        const rooms = await this.roomRepository.find()
        console.log('Found rooms (raw):', JSON.stringify(rooms, null, 2))

        const roomsWithTaxes = rooms.map((room) => {
            console.log(`\nProcessing room ${room.qrtId}:`)

            const roomTaxesForRoom = roomTaxes.filter((tax) => {
                const matches = tax.qtrQuarto === room.qrtId
                console.log(`Tax ${tax.qtrQuarto} matches room ${room.qrtId}? ${matches}`)
                if (matches) {
                    console.log(`Tax value for room ${room.qrtId}:`, tax.qtrValor, typeof tax.qtrValor)
                }
                return matches
            })

            console.log(`Taxes found for room ${room.qrtId}:`, JSON.stringify(roomTaxesForRoom, null, 2))

            const totalTaxValue = roomTaxesForRoom.reduce((sum, tax) => {
                const taxValue = Number(tax.qtrValor)
                console.log(`Adding tax value: ${taxValue} (${typeof taxValue}) to sum: ${sum}`)
                return sum + taxValue
            }, 0)

            console.log(`Total tax value for room ${room.qrtId}: ${totalTaxValue}`)

            return {
                ...room,
                totalTaxValue,
                taxes: roomTaxesForRoom,
            }
        })

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
