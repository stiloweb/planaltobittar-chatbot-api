import { Controller, Get, Param, NotFoundException, BadRequestException } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import { Room } from '../../repository/room.entity'
import { ApiTags, ApiOperation, ApiResponse, ApiParam, ApiBearerAuth } from '@nestjs/swagger'
import { RoomTax } from 'src/repository/room-tax.entity'
import { RoomService } from './room.service'

interface RoomWithTaxes extends Room {
    totalTaxValue: number
    taxes: RoomTax[]
}

@ApiTags('rooms')
@ApiBearerAuth('access-token')
@Controller('room')
export class RoomController {
    constructor(
        @InjectRepository(Room)
        private roomRepository: Repository<Room>,
        @InjectRepository(RoomTax)
        private roomTaxRepository: Repository<RoomTax>,
        private roomService: RoomService,
    ) {}

    @ApiOperation({ summary: 'Listar todos os quartos' })
    @ApiResponse({ status: 200, description: 'Lista de quartos retornada com sucesso', type: [Room] })
    @Get()
    async findAll(): Promise<Room[]> {
        return this.roomRepository.find()
    }

    @ApiOperation({ summary: 'Listar todas as taxas de quarto' })
    @ApiResponse({ status: 200, description: 'Lista de taxas de quarto retornada com sucesso', type: [RoomTax] })
    @Get('taxes')
    async findAllTaxes(): Promise<RoomTax[]> {
        return this.roomTaxRepository.find()
    }

    @ApiOperation({ summary: 'Listar todas as taxas de quarto por data de reserva' })
    @ApiParam({ name: 'checkin', description: 'Data de check-in (formato: YYYY-MM-DD)' })
    @ApiParam({ name: 'checkout', description: 'Data de check-out (formato: YYYY-MM-DD)' })
    @ApiResponse({
        status: 200,
        description: 'Lista de quartos com suas taxas calculadas retornada com sucesso',
        type: [Room],
        schema: {
            properties: {
                qrtId: { type: 'number' },
                qrtNome: { type: 'string' },
                qrtCapacidadeAdulto: { type: 'number' },
                qrtCapacidadeCrianca: { type: 'number' },
                qrtDescricao: { type: 'string' },
                qrtSituacao: { type: 'string' },
                qrtValor: { type: 'number' },
                totalTaxValue: { type: 'number', description: 'Valor total das taxas no período' },
                taxes: {
                    type: 'array',
                    items: {
                        type: 'object',
                        properties: {
                            qtrQuarto: { type: 'number' },
                            qtrData: { type: 'string', format: 'date' },
                            qtrValor: { type: 'number' },
                            qtrQuantidade: { type: 'string' },
                        },
                    },
                },
            },
        },
    })
    @Get('taxes/:checkin/:checkout')
    async findRoomTaxesByReservationDate(
        @Param('checkin') checkinStr: string,
        @Param('checkout') checkoutStr: string,
    ): Promise<RoomWithTaxes[]> {
        const dateRegex = /^\d{4}-\d{2}-\d{2}$/
        if (!dateRegex.test(checkinStr) || !dateRegex.test(checkoutStr)) {
            throw new BadRequestException('As datas devem estar no formato YYYY-MM-DD')
        }

        const checkin = new Date(checkinStr)
        const checkout = new Date(checkoutStr)

        if (isNaN(checkin.getTime()) || isNaN(checkout.getTime())) {
            throw new BadRequestException('Datas inválidas')
        }

        if (checkout < checkin) {
            throw new BadRequestException('A data de checkout deve ser posterior à data de checkin')
        }

        return this.roomService.findRoomTaxesByReservationDate(checkin, checkout)
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
