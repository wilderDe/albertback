import { IsNotEmpty } from 'src/common/validation'

export class CrearCategoriaDto {
  @IsNotEmpty()
  nombre: string
  @IsNotEmpty()
  descripcion: string
  estado?: string
}
