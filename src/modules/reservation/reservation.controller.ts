import { Controller, Get, Param, Query } from '@nestjs/common'
import { ReservationService } from './reservation.service'
import { Reservation } from '../../repository/reservation.entity'
import { Room } from '../../repository/room.entity'
import { ApiTags, ApiOperation, ApiResponse, ApiParam, ApiQuery, ApiBearerAuth } from '@nestjs/swagger'

@ApiTags('reservations')
@ApiBearerAuth('access-token')
@Controller('reservation')
export class ReservationController {
    constructor(private readonly reservationService: ReservationService) {}

    @ApiOperation({ summary: 'Listar todas as reservas' })
    @ApiResponse({ status: 200, description: 'Lista de reservas retornada com sucesso', type: [Reservation] })
    @Get()
    async findAll(): Promise<Reservation[]> {
        return this.reservationService.findAll()
    }

    @ApiOperation({ summary: 'Buscar reserva por ID' })
    @ApiParam({ name: 'id', description: 'ID da reserva' })
    @ApiResponse({ status: 200, description: 'Reserva encontrada com sucesso', type: Reservation })
    @ApiResponse({ status: 404, description: 'Reserva não encontrada' })
    @Get(':id')
    async findOne(@Param('id') id: number): Promise<Reservation> {
        return this.reservationService.findOne(id)
    }

    @ApiOperation({ summary: 'Verificar disponibilidade de quartos' })
    @ApiQuery({ name: 'checkIn', description: 'Data de check-in (YYYY-MM-DD)' })
    @ApiQuery({ name: 'checkOut', description: 'Data de check-out (YYYY-MM-DD)' })
    @ApiQuery({ name: 'adults', description: 'Número de adultos' })
    @ApiQuery({ name: 'children', description: 'Número de crianças' })
    @ApiResponse({ status: 200, description: 'Lista de quartos disponíveis', type: [Room] })
    @Get('availability/check')
    async checkAvailability(
        @Query('checkIn') checkIn: string,
        @Query('checkOut') checkOut: string,
        @Query('adults') adults: number,
        @Query('children') children: number,
    ): Promise<Room[]> {
        return this.reservationService.checkAvailability(checkIn, checkOut, adults, children)
    }
}
