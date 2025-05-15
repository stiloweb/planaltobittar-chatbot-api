import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm'
import { ApiProperty } from '@nestjs/swagger'

@Entity('dad_reserva')
export class Reservation {
    @ApiProperty({ description: 'ID da reserva' })
    @PrimaryGeneratedColumn()
    rsvId: number

    @ApiProperty({ description: 'Data de entrada', example: '2024-04-01' })
    @Column({ type: 'text', nullable: true })
    rsvDataEntrada: string

    @ApiProperty({ description: 'Data de saída', example: '2024-04-05' })
    @Column({ type: 'text', nullable: true })
    rsvDataSaida: string

    @ApiProperty({ description: 'ID do cliente' })
    @Column({ type: 'int', nullable: true })
    rsvCliente: number

    @ApiProperty({ description: 'ID do quarto' })
    @Column({ type: 'int', nullable: true })
    rsvQuartos: number

    @ApiProperty({ description: 'Valor do desconto' })
    @Column({ type: 'text', nullable: true })
    rsvDescValor: string

    @ApiProperty({ description: 'Porcentagem do desconto' })
    @Column({ type: 'text', nullable: true })
    rsvDescPorcentagem: string

    @ApiProperty({ description: 'Observações da reserva' })
    @Column({ type: 'text', nullable: true })
    rsvObservacao: string

    @ApiProperty({ description: 'Desconto aplicado' })
    @Column({ type: 'text', nullable: true })
    rsvDesconto: string

    @ApiProperty({ description: 'Promoção aplicada' })
    @Column({ type: 'text', nullable: true })
    rsvPromocao: string

    @ApiProperty({ description: 'Situação da reserva' })
    @Column({ type: 'text', nullable: true })
    rsvSituacao: string

    @ApiProperty({ description: 'Status de conferência' })
    @Column({ type: 'text', nullable: true })
    rsvConferido: string

    @ApiProperty({ description: 'Local de cadastro' })
    @Column({ type: 'text', nullable: true })
    rsvCadastroLocal: string

    @ApiProperty({ description: 'Data de cadastro' })
    @Column({ type: 'text', nullable: true })
    rsvCadastroData: string

    @ApiProperty({ description: 'Usuário que cadastrou' })
    @Column({ type: 'text', nullable: true })
    rsvCadastroUsuario: string

    @ApiProperty({ description: 'Data da última alteração' })
    @Column({ type: 'text', nullable: true })
    rsvAlteracaoData: string

    @ApiProperty({ description: 'Usuário que alterou por último' })
    @Column({ type: 'text', nullable: true })
    rsvAlteracaoUsuario: string
}
