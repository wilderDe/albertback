import { Inject, Injectable, NotFoundException } from '@nestjs/common'
import { BaseService } from 'src/common/base/base-service'
import { ItemRepository } from '../repository/item.reposiroty'
import { CrearItemDto } from '../dto/item/crear-item.dto'
import { EventoRepository } from '../repository/evento.repository'
import { ActualizarItemDto } from '../dto/item/actualizar-item.dto'
import { Status } from 'src/common/constants'
import { PaginacionQueryDto } from 'src/common/dto/paginacion-query.dto'
import { v4 as uuid } from 'uuid'
import { join } from 'path'
import * as fs from 'fs'

@Injectable()
export class ItemService extends BaseService {
  constructor(
    @Inject(ItemRepository)
    private itemRepositorio: ItemRepository,
    private eventoRepositorio: EventoRepository
  ) {
    super()
  }

  async listarDatos(paginacionQueryDto: PaginacionQueryDto) {
    return this.itemRepositorio.listar(paginacionQueryDto)
  }

  async crear(itemDto: CrearItemDto, file: Express.Multer.File) {
    const evento = await this.eventoRepositorio.buscarPorId(itemDto.evento)
    if (!evento) {
      throw new NotFoundException('No se encontro el evento')
    }
    //Manejo del file
    const extencion = file.mimetype.split('/')[1]
    const nombre = `${uuid()}.${extencion}`
    const destinoFolder =
      '/home/wilder/Agetic/sistema_eventos/agetic-nestjs-base-backend-develop/static/item'
    const path = join(destinoFolder, nombre)
    try {
      fs.mkdirSync(destinoFolder, { recursive: true })
      fs.writeFileSync(path, file.buffer)
      itemDto.imagenItem = nombre
      return this.itemRepositorio.crear(itemDto, evento)
    } catch (error) {
      console.log(error)
      throw new Error('Erro al mover la imagen')
    }
  }

  async actualizarDatos(
    id: string,
    itemDto: ActualizarItemDto,
    file: Express.Multer.File
  ) {
    const destinoFolder = `/home/wilder/Agetic/sistema_eventos/agetic-nestjs-base-backend-develop/static/item/`
    const item = await this.itemRepositorio.buscarPorId(id)
    if (!item) {
      throw new NotFoundException('No se encontro el item del evento')
    }
    const evento = await this.eventoRepositorio.buscarPorId(itemDto.evento)
    if (!evento) {
      throw new NotFoundException('No se encontro el evento')
    }

    if (file) {
      const pathImg = `${destinoFolder}${item.imagenItem}`
      if (fs.existsSync(pathImg)) {
        fs.unlinkSync(pathImg)
      }
      //Mover la nueva imagen
      const extencion = file.mimetype.split('/')[1]
      const nombre = `${uuid()}.${extencion}`
      const path = join(destinoFolder, nombre)
      fs.writeFileSync(path, file.buffer)
      itemDto.imagenItem = nombre
    }
    this.itemRepositorio.actualizar(id, itemDto, evento)
    return { id }
  }

  async inactivar(idItem: string) {
    const item = await this.itemRepositorio.buscarPorId(idItem)
    if (!item) {
      throw new NotFoundException('No se encontro el item')
    }
    const itemDto = new ActualizarItemDto()
    itemDto.estado = Status.INACTIVE
    await this.itemRepositorio.inactivarActivar(idItem, itemDto)
    return {
      id: idItem,
      estado: itemDto.estado,
    }
  }

  async activar(idItem: string) {
    const item = await this.itemRepositorio.buscarPorId(idItem)
    if (!item) {
      throw new NotFoundException('No se encontro el item')
    }
    const itemDto = new ActualizarItemDto()
    itemDto.estado = Status.ACTIVE
    await this.itemRepositorio.inactivarActivar(idItem, itemDto)
    return {
      id: idItem,
      estado: itemDto.estado,
    }
  }
}
