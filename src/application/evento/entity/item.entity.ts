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

export const ItemEstado = {
  ACTIVE: Status.ACTIVE,
  INACTIVE: Status.INACTIVE,
}

@Check(UtilService.buildStatusCheck(ItemEstado))
@Entity({ name: 'items', schema: process.env.DB_SCHEMA_EVENTOS })
export class Item extends AuditoriaEntity {
  @PrimaryGeneratedColumn({
    type: 'bigint',
    name: 'id',
    comment: 'Clave primaria de la tabla Item',
  })
  id: string

  @Column({
    type: 'varchar',
    length: 100,
    comment: 'Horario del sub evento inicio',
  })
  horaInicio: string

  @Column({
    type: 'varchar',
    length: 100,
    comment: 'Horario del sub evento final',
  })
  horaFinal: string

  @Column({
    type: 'varchar',
    length: 100,
    comment: 'nombre y apellidos del expositor',
  })
  expositor: string

  @Column({
    type: 'varchar',
    length: 100,
    comment: 'Tema de sub evento',
  })
  tema: string

  @Column({
    type: 'text',
    comment: 'Detalles del sub evento',
  })
  detalles: string

  @Column({
    type: 'text',
    nullable: true,
    comment: 'Nombre de la imagen de portada',
  })
  imagenItem: string | null

  @ManyToOne(() => Evento, (evento) => evento.items)
  @JoinColumn({
    name: 'id_evento',
    referencedColumnName: 'id',
  })
  evento: Evento

  constructor(data?: Partial<Item>) {
    super(data)
  }

  @BeforeInsert()
  insertarEstado() {
    this.estado = this.estado || ItemEstado.ACTIVE
  }
}
