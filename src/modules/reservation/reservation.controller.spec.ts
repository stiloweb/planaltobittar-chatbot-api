import { ReservationController } from './reservation.controller'
import { ReservationService } from './reservation.service'
import { Reservation } from '../../repository/reservation.entity'
import { Room } from '../../repository/room.entity'

describe('ReservationController', () => {
    let reservationController: ReservationController
    let reservationService: ReservationService

    beforeEach(() => {
        reservationService = {
            findAll: jest.fn(),
            findOne: jest.fn(),
            checkAvailability: jest.fn(),
        } as any
        reservationController = new ReservationController(reservationService)
    })

    describe('findAll', () => {
        it('should return an array of reservations', async () => {
            const result = [new Reservation()]
            jest.spyOn(reservationService, 'findAll').mockResolvedValue(result)

            expect(await reservationController.findAll()).toBe(result)
        })
    })

    describe('findOne', () => {
        it('should return a single reservation', async () => {
            const result = new Reservation()
            jest.spyOn(reservationService, 'findOne').mockResolvedValue(result)

            expect(await reservationController.findOne(1)).toBe(result)
        })
    })

    describe('checkAvailability', () => {
        it('should return available rooms', async () => {
            const result = [new Room()]
            const checkIn = '2024-03-20'
            const checkOut = '2024-03-25'
            const adults = 2
            const children = 1

            jest.spyOn(reservationService, 'checkAvailability').mockResolvedValue(result)

            expect(await reservationController.checkAvailability(checkIn, checkOut, adults, children)).toBe(result)
            expect(reservationService.checkAvailability).toHaveBeenCalledWith(checkIn, checkOut, adults, children)
        })
    })
})
