import { IsNotEmpty } from 'src/common/validation'

export class CrearParticipantesDto {
  @IsNotEmpty()
  idUsuario: string
  @IsNotEmpty()
  evento: string
  estado?: string
}
