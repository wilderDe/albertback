import { Injectable } from '@nestjs/common'
import { Brackets, DataSource } from 'typeorm'
import { CrearCategoriaDto } from '../dto/categoria/crear-categoria.dto'
import { Categoria } from '../entity/categoria.entity'
import { ActualizarCategoriaDto } from '../dto/categoria/actualizar-categoria.dto'
import { PaginacionQueryDto } from 'src/common/dto/paginacion-query.dto'

@Injectable()
export class CategoriaRepository {
  constructor(private dataSource: DataSource) {}

  async buscarPorNombre(nombre: string) {
    return this.dataSource
      .getRepository(Categoria)
      .findOne({ where: { nombre: nombre.toLocaleUpperCase() } })
  }

  async buscarPorId(id: string) {
    return this.dataSource
      .getRepository(Categoria)
      .createQueryBuilder('categoria')
      .where({ id: id })
      .getOne()
  }

  async crear(categoriaDto: CrearCategoriaDto) {
    //usuarioAuditoria: string
    return await this.dataSource
      .getRepository(Categoria)
      .save(new Categoria({ ...categoriaDto, usuarioCreacion: '1' }))
  }

  async actualizar(
    id: string,
    categoriaDto: ActualizarCategoriaDto
    //usuarioAuditoria: string
  ) {
    return await this.dataSource.getRepository(Categoria).update(
      id,
      new Categoria({
        ...categoriaDto,
        usuarioModificacion: '1',
      })
    )
  }

  async listar(paginacionQueryDto: PaginacionQueryDto) {
    const { limite, saltar, filtro, orden, sentido } = paginacionQueryDto
    const query = this.dataSource
      .getRepository(Categoria)
      .createQueryBuilder('categoria')
      .select([
        'categoria.id',
        'categoria.nombre',
        'categoria.descripcion',
        'categoria.estado',
      ])
      .take(limite)
      .skip(saltar)
    switch (orden) {
      case 'id':
        query.addOrderBy('categoria.id', sentido)
        break
      case 'nombre':
        query.addOrderBy('categoria.nombre', sentido)
        break
      case 'descripcion':
        query.addOrderBy('categoria.descripcion', sentido)
        break
      case 'estado':
        query.addOrderBy('categoria.estado', sentido)
        break
      default:
        query.orderBy('categoria.id', 'ASC')
    }

    if (filtro) {
      query.andWhere(
        new Brackets((qb) => {
          qb.orWhere('categoria.nombre ilike :filtro', {
            filtro: `%${filtro}%`,
          })
        })
      )
    }
    return await query.getManyAndCount()
  }
}
