import { UtilService } from '../../../common/lib/util.service'
import {
  BeforeInsert,
  Check,
  Column,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm'
import { Status } from '../../../common/constants'
import dotenv from 'dotenv'
import { AuditoriaEntity } from '../../../common/entity/auditoria.entity'
import { Evento } from './evento.entity'

dotenv.config()

export const CategoriaEstado = {
  ACTIVE: Status.ACTIVE,
  INACTIVE: Status.INACTIVE,
}

@Check(UtilService.buildStatusCheck(CategoriaEstado))
@Entity({ name: 'categorias', schema: process.env.DB_SCHEMA_EVENTOS })
export class Categoria extends AuditoriaEntity {
  @PrimaryGeneratedColumn({
    type: 'bigint',
    name: 'id',
    comment: 'Clave primaria de la tabla Categoria',
  })
  id: string

  @Column({
    type: 'varchar',
    length: 100,
    nullable: false,
    comment: 'Nombre de la categoria del evento',
  })
  nombre: string

  @Column({
    type: 'text',
    comment: 'Descripción de la categoria del evento',
  })
  descripcion: string

  @OneToMany(() => Evento, (evento) => evento.categoria)
  eventos: Evento[]

  constructor(data?: Partial<Categoria>) {
    super(data)
  }

  @BeforeInsert()
  insertarEstado() {
    this.estado = this.estado || CategoriaEstado.ACTIVE
  }
}
