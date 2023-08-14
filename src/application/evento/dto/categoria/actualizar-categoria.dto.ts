import { IsNotEmpty } from 'src/common/validation'

export class ActualizarCategoriaDto {
  @IsNotEmpty()
  nombre: string
  @IsNotEmpty()
  descripcion: string
  estado?: string
}
