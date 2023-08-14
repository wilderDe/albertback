import {
  ConflictException,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common'
import { BaseService } from 'src/common/base/base-service'
import { CrearCategoriaDto } from '../dto/categoria/crear-categoria.dto'
import { CategoriaRepository } from '../repository/categoria.repository'
import { Messages } from 'src/common/constants/response-messages'
import { ActualizarCategoriaDto } from '../dto/categoria/actualizar-categoria.dto'
import { PaginacionQueryDto } from 'src/common/dto/paginacion-query.dto'
import { Status } from 'src/common/constants'

@Injectable()
export class CategoriaService extends BaseService {
  constructor(
    @Inject(CategoriaRepository)
    private categoriaRepositorio: CategoriaRepository
  ) {
    super()
  }

  async listar(paginacionQueryDto: PaginacionQueryDto) {
    return await this.categoriaRepositorio.listar(paginacionQueryDto)
  }

  async crear(categoriaDto: CrearCategoriaDto) {
    //Verificar el nombre de la categoria sea unica
    categoriaDto.nombre = categoriaDto.nombre.toLocaleUpperCase()
    const categoria = await this.categoriaRepositorio.buscarPorNombre(
      categoriaDto.nombre
    )
    if (categoria) {
      throw new ConflictException(Messages.REPEATED_NAME_CATEGORIA)
    }
    return await this.categoriaRepositorio.crear(categoriaDto)
  }

  async actualizarDatos(
    id: string,
    categoriaDto: ActualizarCategoriaDto
    //usuarioAuditoria: string
  ) {
    if (categoriaDto.nombre) {
      categoriaDto.nombre = categoriaDto.nombre.toLocaleUpperCase()
    }
    const categoria = await this.categoriaRepositorio.buscarPorId(id)
    if (!categoria) {
      throw new NotFoundException(Messages.NOT_FOUNT_CATEGORIA_ID)
    }
    const categoriaNombre = await this.categoriaRepositorio.buscarPorNombre(
      categoriaDto.nombre
    )
    if (categoriaNombre && categoriaNombre.id !== categoria.id) {
      throw new Error(Messages.EXIST_NAME__CATEGORIA_REPEAT)
    }
    await this.categoriaRepositorio.actualizar(id, categoriaDto)
    return { id }
  }

  async inactivar(idCategoria: string) {
    const categoria = await this.categoriaRepositorio.buscarPorId(idCategoria)
    if (!categoria) {
      throw new NotFoundException(Messages.NOT_FOUNT_CATEGORIA_ID)
    }
    const categoriaDto = new ActualizarCategoriaDto()
    categoriaDto.estado = Status.INACTIVE
    await this.categoriaRepositorio.actualizar(idCategoria, categoriaDto)
    return {
      id: idCategoria,
      estado: categoriaDto.estado,
    }
  }

  async activar(idCategoria: string) {
    const categoria = await this.categoriaRepositorio.buscarPorId(idCategoria)
    if (!categoria) {
      throw new NotFoundException(Messages.NOT_FOUNT_CATEGORIA_ID)
    }
    const categoriaDto = new ActualizarCategoriaDto()
    categoriaDto.estado = Status.ACTIVE
    await this.categoriaRepositorio.actualizar(idCategoria, categoriaDto)
    return {
      id: idCategoria,
      estado: categoriaDto.estado,
    }
  }
}
