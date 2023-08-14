import { Inject, Injectable, NotFoundException } from '@nestjs/common'
import { BaseService } from 'src/common/base/base-service'
import { ParticipanteRepository } from '../repository/participante.repository'
import { CrearParticipantesDto } from '../dto/participantes/crear-participantes.dto'
import { EventoRepository } from '../repository/evento.repository'

@Injectable()
export class ParticipanteService extends BaseService {
  constructor(
    @Inject(ParticipanteRepository)
    private participanteRepositorio: ParticipanteRepository,
    private eventoRepositorio: EventoRepository
  ) {
    super()
  }

  async crear(participanteDto: CrearParticipantesDto) {
    //Validar el id del usuario
    const evento = await this.eventoRepositorio.buscarPorId(
      participanteDto.evento
    )
    if (!evento) {
      throw new NotFoundException('No se encontro el evento a registrarse')
    }
    return await this.participanteRepositorio.crear(participanteDto, evento)
  }
}
