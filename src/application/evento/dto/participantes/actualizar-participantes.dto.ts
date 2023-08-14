import { IsNotEmpty } from 'src/common/validation'

export class ActualizarParticipantesDto {
  @IsNotEmpty()
  idUsuario: string
  @IsNotEmpty()
  evento: string
  estado?: string
}
