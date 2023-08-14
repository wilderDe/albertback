import { Injectable } from '@nestjs/common'
import { Brackets, DataSource } from 'typeorm'
import { Item } from '../entity/item.entity'
import { CrearItemDto } from '../dto/item/crear-item.dto'
import { Evento } from '../entity/evento.entity'
import { ActualizarItemDto } from '../dto/item/actualizar-item.dto'
import { PaginacionQueryDto } from 'src/common/dto/paginacion-query.dto'

@Injectable()
export class ItemRepository {
  constructor(private dataSource: DataSource) {}

  async buscarPorTema(tema: string) {
    return this.dataSource
      .getRepository(Item)
      .findOne({ where: { tema: tema.toLocaleUpperCase() } })
  }

  async buscarPorId(id: string) {
    return this.dataSource
      .getRepository(Item)
      .createQueryBuilder('item')
      .where({ id: id })
      .getOne()
  }

  async crear(itemDto: CrearItemDto, evento: Evento) {
    return await this.dataSource.getRepository(Item).save(
      new Item({
        horaInicio: itemDto.horaInicio,
        horaFinal: itemDto.horaFinal,
        expositor: itemDto.expositor,
        tema: itemDto.tema,
        detalles: itemDto.detalles,
        imagenItem: itemDto.imagenItem,
        evento: evento,
        usuarioCreacion: '1',
      })
    )
  }

  async actualizar(id: string, itemDto: ActualizarItemDto, evento: Evento) {
    return await this.dataSource.getRepository(Item).update(
      id,
      new Item({
        ...itemDto,
        evento: evento,
        usuarioModificacion: '1',
      })
    )
  }

  async listar(paginacionQueryDto: PaginacionQueryDto) {
    const { limite, saltar, filtro, orden, sentido } = paginacionQueryDto
    const query = this.dataSource
      .getRepository(Item)
      .createQueryBuilder('item')
      .select([
        'item.id',
        'item.horaInicio',
        'item.horaFinal',
        'item.expositor',
        'item.tema',
        'item.detalles',
        'item.estado',
        'item.imagenItem',
        'item.evento.id',
      ])
      .leftJoinAndSelect('item.evento', 'evento')
      .take(limite)
      .skip(saltar)
    switch (orden) {
      case 'id':
        query.addOrderBy('item.id', sentido)
        break
      case 'horario':
        query.addOrderBy('item.horario', sentido)
        break
      case 'expositor':
        query.addOrderBy('item.expositor', sentido)
        break
      case 'tema':
        query.addOrderBy('item.tema', sentido)
        break
      case 'detalles':
        query.addOrderBy('item.detalles', sentido)
        break
      case 'evento':
        query.addOrderBy('evento.id', sentido)
        break
      default:
        query.orderBy('item.id', 'ASC')
    }
    if (filtro) {
      query.andWhere(
        new Brackets((qb) => {
          qb.orWhere('item.tema ilike :filtro', {
            filtro: `%${filtro}%`,
          })
          qb.orWhere('item.expositor ilike :filtro', {
            filtro: `%${filtro}%`,
          })
          qb.orWhere('evento.nombre ilike :filtro', {
            filtro: `%${filtro}%`,
          })
        })
      )
    }
    return await query.getManyAndCount()
  }

  async inactivarActivar(id: string, itemDto: ActualizarItemDto) {
    return await this.dataSource.getRepository(Item).update(
      id,
      new Item({
        estado: itemDto.estado,
        usuarioModificacion: '1',
      })
    )
  }
}
