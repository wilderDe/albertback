import { IsNotEmpty } from 'src/common/validation'

export class ActualizarItemDto {
  @IsNotEmpty()
  horaInicio: string
  @IsNotEmpty()
  horaFinal: string
  @IsNotEmpty()
  expositor: string
  @IsNotEmpty()
  tema: string
  @IsNotEmpty()
  detalles: string
  @IsNotEmpty()
  evento: string
  imagenItem?: string
  estado?: string
}
