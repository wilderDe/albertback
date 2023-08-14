import { Injectable } from '@nestjs/common'
import { DataSource } from 'typeorm'
import { Participantes } from '../entity/participantes.entity'
import { CrearParticipantesDto } from '../dto/participantes/crear-participantes.dto'
import { Evento } from '../entity/evento.entity'

@Injectable()
export class ParticipanteRepository {
  constructor(private dataSource: DataSource) {}

  async buscarPorId(id: string) {
    return this.dataSource
      .getRepository(Participantes)
      .createQueryBuilder('categoria')
      .where({ id: id })
      .getOne()
  }

  async crear(participanteDto: CrearParticipantesDto, evento: Evento) {
    return await this.dataSource.getRepository(Participantes).save(
      new Participantes({
        ...participanteDto,
        evento: evento,
        usuarioCreacion: '1',
      })
    )
  }
}
