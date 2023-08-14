import { UtilService } from '../../../common/lib/util.service'
import {
  BeforeInsert,
  Check,
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm'

import { Status } from '../../../common/constants'
import dotenv from 'dotenv'
import { AuditoriaEntity } from '../../../common/entity/auditoria.entity'
import { Categoria } from './categoria.entity'
import { Item } from './item.entity'
import { Participantes } from './participantes.entity'

dotenv.config()

export const EventoEstado = {
  ACTIVE: Status.ACTIVE,
  INACTIVE: Status.INACTIVE,
}

@Check(UtilService.buildStatusCheck(EventoEstado))
@Entity({ name: 'eventos', schema: process.env.DB_SCHEMA_EVENTOS })
export class Evento extends AuditoriaEntity {
  @PrimaryGeneratedColumn({
    type: 'bigint',
    name: 'id',
    comment: 'Clave primaria de la tabla Eventos',
  })
  id: string

  @Column({
    length: 100,
    type: 'varchar',
    nullable: false,
    comment: 'Nombre del evento',
  })
  nombre: string

  @Column({
    name: 'fecha_evento',
    type: 'date',
    nullable: false,
    comment: 'Fecha del evento',
  })
  fechaEvento: Date

  @Column({
    type: 'text',
    nullable: true,
    comment: 'Ubicación del evento o Link del evento',
  })
  ubicacion: string

  @Column({
    type: 'text',
    nullable: false,
    comment: 'Descripción del evento a realizar',
  })
  descripcion: string

  @Column({
    type: 'varchar',
    length: 20,
    comment: 'Modalidad del evento Virtual o Presencial',
  })
  modalidad: string

  @Column({
    type: 'text',
    nullable: true,
    comment: 'Nombre de la imagen de portada',
  })
  imagenEvento: string | null

  @ManyToOne(() => Categoria)
  @JoinColumn({
    name: 'id_categoria',
    referencedColumnName: 'id',
  })
  categoria: Categoria

  @OneToMany(() => Item, (item) => item.evento)
  items: Item[]

  @OneToMany(() => Participantes, (participantes) => participantes.evento)
  participantes: Participantes[]

  constructor(data?: Partial<Evento>) {
    super(data)
  }

  @BeforeInsert()
  insertarEstado() {
    this.estado = this.estado || EventoEstado.ACTIVE
  }
}
