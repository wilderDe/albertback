import { Inject, Injectable, NotFoundException } from '@nestjs/common'
import { BaseService } from 'src/common/base/base-service'
import { EventoRepository } from '../repository/evento.repository'
import { CrearEventoDto } from '../dto/evento/crear-evento.dto'
import { CategoriaRepository } from '../repository/categoria.repository'
import { ActualizarEventoDto } from '../dto/evento/actualizar-evento.dto'
import { PaginacionQueryDto } from 'src/common/dto/paginacion-query.dto'
import { Status } from 'src/common/constants'
import { v4 as uuid } from 'uuid'
import { join } from 'path'
import * as fs from 'fs'
import { InjectRepository } from '@nestjs/typeorm'
import { Usuario } from 'src/core/usuario/entity/usuario.entity'
import { Repository } from 'typeorm'
import axios from 'axios'
import { TemplateEmailService } from 'src/common/templates/templates-email.service'

@Injectable()
export class EventoService extends BaseService {
  constructor(
    @Inject(EventoRepository)
    private eventoRepositorio: EventoRepository,
    private categoriaRepositorio: CategoriaRepository,

    @InjectRepository(Usuario)
    private usuarioRepository: Repository<Usuario>
  ) {
    super()
  }

  async listar(paginacionQueryDto: PaginacionQueryDto) {
    return await this.eventoRepositorio.listar(paginacionQueryDto)
  }

  async optenerEventoForm() {
    return await this.eventoRepositorio.formEvento()
  }

  async enviarEmailEvento(
    id: string,
    descripcion: string,
    file: Express.Multer.File
  ) {
    const evento = await this.eventoRepositorio.obtenerParticipantes(id)
    const idsDeParticipantes = evento.map(
      (participante) => participante.participante_idUsuario
    )
    const idsUnicos = [...new Set(idsDeParticipantes)]
    const usuario = await this.usuarioRepository
      .createQueryBuilder('usuario')
      .whereInIds(idsUnicos)
      .getMany()

    //Enviar Email
    const url = 'https://chasqui.test.gtic.gob.bo/ws/api/envios/correo'
    const headers = {
      Authorization:
        'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjkyODQ2NGU5LWEzNTItNGUyZC04MGMwLTZlNjdmNjZlN2QxOCIsInJvbGVzIjpbIlRFQ05JQ08iXSwidHZ0IjoiMTY4NDI0NTE1OTYyMCIsImlhdCI6MTY4NDI0NTE1OSwiZXhwIjoxNjg0MjQ1NDU5fQ.bwvKk5RDGx3VpQlGwohQbSTYDSQ9HpgzNUbAAwSR4wQ',
      'Content-Type': 'application/json',
    }
    const urlLogo = './public/logo.jpg'
    const imageBuffer = fs.readFileSync(urlLogo)
    const template = TemplateEmailService.armarPlantillaRecordatorioEvento(
      evento[0].evento_nombre,
      descripcion,
      file.buffer,
      imageBuffer
    )
    for (const iterator of usuario) {
      const data = {
        de: 'SISTEMAPPX <haciendoprueba@agetic.gob.bo>',
        para: [`${iterator.correoElectronico}`],
        cc: ['deniz3@yopmail.com'],
        bcc: ['deniz4@yopmail.com'],
        asunto: 'Falta poco para el gran evento no te lo pierdas',
        contenido: template,
        tipo: 1,
        metadata: { id_sistema: 'aaaa', factura: '123456' },
      }
      try {
        await axios.post(url, data, { headers })
        this.logger.info(
          `Correo enviado con éxito a ${iterator.correoElectronico}`
        )
      } catch (error) {
        throw new Error('Error al hacer el post de enviar email')
      }
    }
    return {
      msg: 'Correos enviados con éxito',
    }
  }

  async crear(eventoDto: CrearEventoDto, file: Express.Multer.File) {
    const categoria = await this.categoriaRepositorio.buscarPorId(
      eventoDto.categoria
    )
    if (!categoria) {
      throw new NotFoundException('No se encontro la categoria')
    }
    //Manejo del file
    const extencion = file.mimetype.split('/')[1]
    const nombre = `${uuid()}.${extencion}`
    const destinoFolder =
      '/home/wilder/Agetic/sistema_eventos/agetic-nestjs-base-backend-develop/static/evento'
    const path = join(destinoFolder, nombre)
    try {
      fs.mkdirSync(destinoFolder, { recursive: true })
      fs.writeFileSync(path, file.buffer)
      eventoDto.nombre = eventoDto.nombre.toLocaleUpperCase()
      eventoDto.modalidad = eventoDto.modalidad.toLocaleUpperCase()
      eventoDto.imagenEvento = nombre
      return await this.eventoRepositorio.crear(eventoDto, categoria)
    } catch (error) {
      console.log(error)
      throw new Error('Error al mover la imagen')
    }
  }

  async actualizarDatos(
    id: string,
    eventoDto: ActualizarEventoDto,
    file: Express.Multer.File
  ) {
    const destinoFolder = `/home/wilder/Agetic/sistema_eventos/agetic-nestjs-base-backend-develop/static/evento/`
    if (eventoDto.nombre) {
      eventoDto.nombre = eventoDto.nombre.toLocaleUpperCase()
    }
    const evento = await this.eventoRepositorio.buscarPorId(id)
    if (!evento) {
      throw new NotFoundException('No se encontro un evento')
    }
    const categoria = await this.categoriaRepositorio.buscarPorId(
      eventoDto.categoria
    )
    if (!categoria) {
      throw new NotFoundException('No se encontro la categoria')
    }
    eventoDto.nombre = eventoDto.nombre.toLocaleUpperCase()
    eventoDto.modalidad = eventoDto.modalidad.toLocaleUpperCase()

    if (file) {
      //Si viene el file eliminar el file guardado
      const pathImg = `${destinoFolder}${evento.imagenEvento}`
      if (fs.existsSync(pathImg)) {
        fs.unlinkSync(pathImg)
      }
      //Mover la nueva imagen
      const extencion = file.mimetype.split('/')[1]
      const nombre = `${uuid()}.${extencion}`
      const path = join(destinoFolder, nombre)
      fs.writeFileSync(path, file.buffer)
      eventoDto.imagenEvento = nombre
    }

    await this.eventoRepositorio.actualizar(id, eventoDto, categoria)
    return { id }
  }

  async inactivar(idEvento: string) {
    const evento = await this.eventoRepositorio.buscarPorId(idEvento)
    if (!evento) {
      throw new NotFoundException('No se encontro un evento')
    }
    const eventoDto = new ActualizarEventoDto()
    eventoDto.estado = Status.INACTIVE
    await this.eventoRepositorio.inactivarActivar(idEvento, eventoDto)
    return {
      id: idEvento,
      estado: eventoDto.estado,
    }
  }

  async activar(idEvento: string) {
    const evento = await this.eventoRepositorio.buscarPorId(idEvento)
    if (!evento) {
      throw new NotFoundException('No se encontro un evento')
    }
    const eventoDto = new ActualizarEventoDto()
    eventoDto.estado = Status.ACTIVE
    await this.eventoRepositorio.inactivarActivar(idEvento, eventoDto)
    return {
      id: idEvento,
      estado: eventoDto.estado,
    }
  }
}
