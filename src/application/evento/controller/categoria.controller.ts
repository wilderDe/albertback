import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Post,
  Query,
  Req,
  UseGuards,
} from '@nestjs/common'
//import { JwtAuthGuard } from '../../core/authentication/guards/jwt-auth.guard'
//import { CasbinGuard } from '../../core/authorization/guards/casbin.guard'
import { BaseController } from '../../../common/base/base-controller'
import { CrearCategoriaDto } from '../dto/categoria/crear-categoria.dto'
import { CategoriaService } from '../service/categoria.service'
import { ParamIdDto } from 'src/common/dto/params-id.dto'
import { ActualizarCategoriaDto } from '../dto/categoria/actualizar-categoria.dto'
import { PaginacionQueryDto } from 'src/common/dto/paginacion-query.dto'

@Controller('categoria')
//@UseGuards(JwtAuthGuard, CasbinGuard)
export class CategoriaController extends BaseController {
  constructor(private categoriaServicio: CategoriaService) {
    super()
  }

  @Get()
  async listar(@Query() paginacionQueryDto: PaginacionQueryDto) {
    const result = await this.categoriaServicio.listar(paginacionQueryDto)
    return this.successListRows(result)
  }

  @Post()
  async crear(@Body() categoriaDto: CrearCategoriaDto) {
    //const usuarioAuditoria = this.getUser(req)
    const result = await this.categoriaServicio.crear(categoriaDto)
    return this.successCreate(result)
  }

  @Patch(':id')
  async actualizar(
    @Param() params: ParamIdDto,
    @Body() categoriaDto: ActualizarCategoriaDto
  ) {
    const { id: idCategoria } = params
    //const usuarioAuditoria = this.getUser(req)
    const result = await this.categoriaServicio.actualizarDatos(
      idCategoria,
      categoriaDto
    )
    return this.successUpdate(result)
  }

  @Patch('/:id/inactivacion')
  async inactivar(@Param() params: ParamIdDto) {
    const { id: idCategoria } = params
    const result = await this.categoriaServicio.inactivar(idCategoria)
    return this.successUpdate(result)
  }

  @Patch('/:id/activacion')
  async activar(@Param() params: ParamIdDto) {
    const { id: idCategoria } = params
    const result = await this.categoriaServicio.activar(idCategoria)
    return this.successUpdate(result)
  }
}
