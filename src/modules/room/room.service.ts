import { Injectable, NotFoundException } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import { Room } from '../../repository/room.entity'

@Injectable()
export class RoomService {
    constructor(
        @InjectRepository(Room)
        private roomRepository: Repository<Room>,
    ) {}

    async findAll(): Promise<Room[]> {
        return this.roomRepository.find()
    }

    async findOne(id: number): Promise<Room> {
        const room = await this.roomRepository.findOne({ where: { qrtId: id } })
        if (!room) {
            throw new NotFoundException(`Room with ID ${id} not found`)
        }
        return room
    }
}
