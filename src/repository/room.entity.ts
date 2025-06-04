import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm'
import { ApiProperty } from '@nestjs/swagger'

@Entity('dad_quarto')
export class Room {
    @ApiProperty({ description: 'ID do quarto' })
    @PrimaryGeneratedColumn()
    qrtId: number

    @ApiProperty({ description: 'Nome do quarto' })
    @Column({ type: 'text', nullable: true })
    qrtNome: string

    @ApiProperty({ description: 'Capacidade de adultos' })
    @Column({ type: 'int', nullable: true })
    qrtCapacidadeAdulto: number

    @ApiProperty({ description: 'Capacidade de crianças' })
    @Column({ type: 'int', nullable: true })
    qrtCapacidadeCrianca: number

    @ApiProperty({ description: 'Descrição do quarto' })
    @Column({ type: 'text', nullable: true })
    qrtDescricao: string

    @ApiProperty({ description: 'Situação do quarto' })
    @Column({ type: 'text', nullable: true })
    qrtSituacao: string

    @ApiProperty({ description: 'Data da última alteração' })
    @Column({ type: 'text', nullable: true })
    qrtAlteracaoData: string

    @ApiProperty({ description: 'Usuário que alterou por último' })
    @Column({ type: 'int', nullable: true })
    qrtAlteracaoUsuario: number
}
