import { Injectable } from '@nestjs/common'
import { Brackets, DataSource } from 'typeorm'
import { Evento } from '../entity/evento.entity'
import { CrearEventoDto } from '../dto/evento/crear-evento.dto'
import { Categoria } from '../entity/categoria.entity'
import { ActualizarEventoDto } from '../dto/evento/actualizar-evento.dto'
import { PaginacionQueryDto } from 'src/common/dto/paginacion-query.dto'
import { Participantes } from '../entity/participantes.entity'
//import { Item } from '../entity/item.entity'
//import { Participantes } from '../entity/participantes.entity'

@Injectable()
export class EventoRepository {
  constructor(private dataSource: DataSource) {}

  async buscarPorNombre(nombre: string) {
    return this.dataSource
      .getRepository(Evento)
      .findOne({ where: { nombre: nombre.toLocaleUpperCase() } })
  }

  async buscarPorId(id: string) {
    return this.dataSource
      .getRepository(Evento)
      .createQueryBuilder('categoria')
      .where({ id: id })
      .getOne()
  }

  async formEvento() {
    return this.dataSource
      .getRepository(Evento)
      .createQueryBuilder('evento')
      .select(['evento.id', 'evento.nombre'])
      .where('evento.estado = :estado', { estado: 'ACTIVO' })
      .getMany()
  }

  async obtenerParticipantes(id: string) {
    return this.dataSource
      .getRepository(Participantes)
      .createQueryBuilder('participante')
      .select(['participante.idUsuario', 'evento.nombre'])
      .leftJoin('participante.evento', 'evento')
      .where('evento.id = :id', { id: id })
      .getRawMany()
  }

  async crear(eventoDto: CrearEventoDto, categoria: Categoria) {
    return await this.dataSource.getRepository(Evento).save(
      new Evento({
        nombre: eventoDto.nombre,
        fechaEvento: eventoDto.fechaEvento,
        ubicacion: eventoDto.ubicacion,
        descripcion: eventoDto.descripcion,
        modalidad: eventoDto.modalidad,
        imagenEvento: eventoDto.imagenEvento,
        usuarioCreacion: '1',
        categoria: categoria,
      })
    )
  }
  async actualizar(
    id: string,
    eventoDto: ActualizarEventoDto,
    categoria: Categoria
  ) {
    return this.dataSource.getRepository(Evento).update(
      id,
      new Evento({
        ...eventoDto,
        categoria: categoria,
        usuarioModificacion: '1',
      })
    )
  }

  async inactivarActivar(id: string, eventoDto: ActualizarEventoDto) {
    return await this.dataSource.getRepository(Evento).update(
      id,
      new Evento({
        estado: eventoDto.estado,
        usuarioModificacion: '1',
      })
    )
  }

  async listar(paginacionQueryDto: PaginacionQueryDto) {
    const { limite, saltar, filtro, orden, sentido } = paginacionQueryDto
    const query = this.dataSource
      .getRepository(Evento)
      .createQueryBuilder('evento')
      .select([
        'evento.id',
        'evento.nombre',
        'evento.fechaEvento',
        'evento.ubicacion',
        'evento.descripcion',
        'evento.modalidad',
        'evento.imagenEvento',
        'evento.estado',
      ])
      .leftJoinAndSelect('evento.categoria', 'categoria')
      .leftJoinAndSelect('evento.items', 'item')
      .leftJoinAndSelect('evento.participantes', 'participantes')
      .take(limite)
      .skip(saltar)
    switch (orden) {
      case 'id':
        query.addOrderBy('evento.id', sentido)
        break
      case 'nombre':
        query.addOrderBy('evento.nombre', sentido)
        break
      case 'fechaEvento':
        query.addOrderBy('evento.fechaEvento', sentido)
        break
      default:
        query.orderBy('evento.id', 'ASC')
    }

    if (filtro) {
      console.log(filtro)
      query.andWhere(
        new Brackets((qb) => {
          qb.orWhere('evento.nombre ilike :filtro', { filtro: `%${filtro}%` })
        })
      )
    }
    return await query.getManyAndCount()
  }
}
