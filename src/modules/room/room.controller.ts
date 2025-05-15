import { Controller, Get, Param, NotFoundException } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import { Room } from '../../repository/room.entity'
import { ApiTags, ApiOperation, ApiResponse, ApiParam, ApiBearerAuth } from '@nestjs/swagger'

@ApiTags('rooms')
@ApiBearerAuth('access-token')
@Controller('room')
export class RoomController {
    constructor(
        @InjectRepository(Room)
        private roomRepository: Repository<Room>,
    ) {}

    @ApiOperation({ summary: 'Listar todos os quartos' })
    @ApiResponse({ status: 200, description: 'Lista de quartos retornada com sucesso', type: [Room] })
    @Get()
    async findAll(): Promise<Room[]> {
        return this.roomRepository.find()
    }

    @ApiOperation({ summary: 'Buscar quarto por ID' })
    @ApiParam({ name: 'id', description: 'ID do quarto' })
    @ApiResponse({ status: 200, description: 'Quarto encontrado com sucesso', type: Room })
    @ApiResponse({ status: 404, description: 'Quarto não encontrado' })
    @Get(':id')
    async findOne(@Param('id') id: number): Promise<Room> {
        const room = await this.roomRepository.findOne({ where: { qrtId: id } })
        if (!room) {
            throw new NotFoundException(`Room with ID ${id} not found`)
        }
        return room
    }
}
