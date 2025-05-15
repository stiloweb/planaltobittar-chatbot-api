import { RoomController } from './room.controller'
import { Repository } from 'typeorm'
import { Room } from '../../repository/room.entity'

describe('RoomController', () => {
    let roomController: RoomController
    let roomRepository: Repository<Room>

    beforeEach(() => {
        roomRepository = {
            find: jest.fn(),
            findOne: jest.fn(),
        } as any
        roomController = new RoomController(roomRepository)
    })

    describe('findAll', () => {
        it('should return an array of rooms', async () => {
            const result = [new Room()]
            jest.spyOn(roomRepository, 'find').mockResolvedValue(result)

            expect(await roomController.findAll()).toBe(result)
        })
    })
})
