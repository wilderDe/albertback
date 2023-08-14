import { Body, Controller, Post } from '@nestjs/common'
import { BaseController } from 'src/common/base/base-controller'
import { ParticipanteService } from '../service/participantes.service'
import { CrearParticipantesDto } from '../dto/participantes/crear-participantes.dto'

@Controller('participante')
export class ParticipanteController extends BaseController {
  constructor(private participanteService: ParticipanteService) {
    super()
  }

  @Post()
  async registrar(@Body() participanteDto: CrearParticipantesDto) {
    const result = await this.participanteService.crear(participanteDto)
    return this.successCreate(result)
  }
}
