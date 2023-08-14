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
import { EventoService } from '../service/evento.service'
import { CrearEventoDto } from '../dto/evento/crear-evento.dto'
import { ActualizarEventoDto } from '../dto/evento/actualizar-evento.dto'
import { ParamIdDto } from 'src/common/dto/params-id.dto'
import { PaginacionQueryDto } from 'src/common/dto/paginacion-query.dto'
import { FileInterceptor } from '@nestjs/platform-express'
import { join } from 'path'
import { createReadStream } from 'fs'

@Controller('evento')
export class EventoController extends BaseController {
  constructor(private eventoServicio: EventoService) {
    super()
  }

  @Get()
  async listar(@Query() paginacionQueryDto: PaginacionQueryDto) {
    const result = await this.eventoServicio.listar(paginacionQueryDto)
    return this.successListRows(result)
  }

  @Get(':nombre')
  //@Header('Content-Type', 'image/jpeg')
  @Header('Content-Disposition', 'attachment; filename="*"')
  mostrarFile(@Param('nombre') nombre: string) {
    const destinoFolder = './static/evento/'
    const path = join(destinoFolder, nombre)
    const stream = createReadStream(path)
    return new StreamableFile(stream)
  }

  @Get('formulario/opt')
  async eventoFormulario() {
    const result = await this.eventoServicio.optenerEventoForm()
    return this.success(result)
  }

  @Post()
  @UseInterceptors(FileInterceptor('file'))
  async crear(
    @Body() eventoDto: CrearEventoDto,
    @UploadedFile() file: Express.Multer.File
  ) {
    console.log(eventoDto)
    console.log(file)
    if (!file) throw new Error('No se encontro ningun archivo')
    const result = await this.eventoServicio.crear(eventoDto, file)
    return this.successCreate(result)
  }

  @Post('/email/:id')
  @UseInterceptors(FileInterceptor('file'))
  async email(
    @Param('id') id: string,
    @Body() body: { descripcion: string },
    @UploadedFile() file: Express.Multer.File
  ) {
    const result = this.eventoServicio.enviarEmailEvento(
      id,
      body.descripcion,
      file
    )
    return this.success(result)
  }

  @Patch(':id')
  @UseInterceptors(FileInterceptor('file'))
  async actualizar(
    @Param() params: ParamIdDto,
    @Body() eventoDto: ActualizarEventoDto,
    @UploadedFile() file: Express.Multer.File
  ) {
    const { id: idEvento } = params
    const result = await this.eventoServicio.actualizarDatos(
      idEvento,
      eventoDto,
      file
    )
    return this.successUpdate(result)
  }

  @Patch('/:id/inactivacion')
  async inactivar(@Param() params: ParamIdDto) {
    const { id: idEvento } = params
    const result = await this.eventoServicio.inactivar(idEvento)
    return this.successUpdate(result)
  }

  @Patch('/:id/activacion')
  async activar(@Param() params: ParamIdDto) {
    const { id: idEvento } = params
    const result = await this.eventoServicio.activar(idEvento)
    return this.successUpdate(result)
  }
}
