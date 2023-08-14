import {
  Body,
  Controller,
  Get,
  Header,
  Param,
  Patch,
  Post,
  Query,
  StreamableFile,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common'
import { BaseController } from 'src/common/base/base-controller'
import { CrearItemDto } from '../dto/item/crear-item.dto'
import { ItemService } from '../service/item.service'
import { ParamIdDto } from 'src/common/dto/params-id.dto'
import { ActualizarItemDto } from '../dto/item/actualizar-item.dto'
import { PaginacionQueryDto } from 'src/common/dto/paginacion-query.dto'
import { FileInterceptor } from '@nestjs/platform-express'
import { join } from 'path'
import { createReadStream } from 'fs'

@Controller('item')
export class ItemController extends BaseController {
  constructor(private itemServicio: ItemService) {
    super()
  }

  @Get()
  async listar(@Query() paginacionQueryDto: PaginacionQueryDto) {
    const result = await this.itemServicio.listarDatos(paginacionQueryDto)
    return this.successListRows(result)
  }

  @Get(':nombre')
  @Header('Content-Disposition', 'attachment; filename="*"')
  mostrarFile(@Param('nombre') nombre: string) {
    const destinoFolder = './static/item'
    const path = join(destinoFolder, nombre)
    const stream = createReadStream(path)
    return new StreamableFile(stream)
  }

  @Post()
  @UseInterceptors(FileInterceptor('file'))
  async crear(
    @Body() itemDto: CrearItemDto,
    @UploadedFile() file: Express.Multer.File
  ) {
    if (!file) throw new Error('No se encontro ningun archivo')
    const result = await this.itemServicio.crear(itemDto, file)
    return this.successList(result)
  }

  @Patch(':id')
  @UseInterceptors(FileInterceptor('file'))
  async actualizar(
    @Param() params: ParamIdDto,
    @Body() itemDto: ActualizarItemDto,
    @UploadedFile() file: Express.Multer.File
  ) {
    const { id: idItem } = params
    const result = await this.itemServicio.actualizarDatos(
      idItem,
      itemDto,
      file
    )
    return this.successUpdate(result)
  }

  @Patch('/:id/inactivacion')
  async inactivar(@Param() params: ParamIdDto) {
    const { id: idItem } = params
    const result = await this.itemServicio.inactivar(idItem)
    return this.successUpdate(result)
  }

  @Patch('/:id/activacion')
  async activar(@Param() params: ParamIdDto) {
    const { id: idItem } = params
    const result = await this.itemServicio.activar(idItem)
    return this.successUpdate(result)
  }
}
