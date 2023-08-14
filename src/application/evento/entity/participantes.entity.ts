import { UtilService } from '../../../common/lib/util.service'
import {
  BeforeInsert,
  Check,
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm'
import dotenv from 'dotenv'
import { AuditoriaEntity } from '../../../common/entity/auditoria.entity'
import { Status } from '../../../common/constants'
import { Evento } from './evento.entity'

dotenv.config()

export const ParticipantesEstado = {
  ACTIVE: Status.ACTIVE,
  INACTIVE: Status.INACTIVE,
}

@Check(UtilService.buildStatusCheck(ParticipantesEstado))
@Entity({ name: 'participantes', schema: process.env.DB_SCHEMA_EVENTOS })
export class Participantes extends AuditoriaEntity {
  @PrimaryGeneratedColumn({
    type: 'bigint',
    name: 'id',
    comment: 'Clave primaria de la tabla participantes',
  })
  id: string

  @Column({
    type: 'bigint',
    comment: 'Clave primaria de usuario que participio en el evento',
  })
  idUsuario: string

  @ManyToOne(() => Evento, (evento) => evento.participantes)
  @JoinColumn({
    name: 'id_evento',
    referencedColumnName: 'id',
  })
  evento: Evento

  constructor(data?: Partial<Participantes>) {
    super(data)
  }

  @BeforeInsert()
  insertarEstado() {
    this.estado = this.estado || ParticipantesEstado.ACTIVE
  }
}
