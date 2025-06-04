import { ApiProperty } from '@nestjs/swagger'
import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm'

@Entity()
export class RoomTax {
    @ApiProperty({ description: 'ID do quarto' })
    @PrimaryGeneratedColumn()
    qtrQuarto: number

    @ApiProperty({ description: 'Data da taxa' })
    @Column()
    qtrData: Date

    @ApiProperty({ description: 'Valor da taxa' })
    @Column()
    qtrValor: number

    @ApiProperty({ description: 'Quantidade disponível' })
    @Column()
    qtrQuantidade: string
}
