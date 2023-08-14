import { IsNotEmpty } from 'src/common/validation'

export class CrearEventoDto {
  @IsNotEmpty()
  nombre: string
  @IsNotEmpty()
  fechaEvento: Date
  @IsNotEmpty()
  ubicacion: string
  @IsNotEmpty()
  descripcion: string
  @IsNotEmpty()
  modalidad: string
  @IsNotEmpty()
  categoria: string
  imagenEvento: string
  estado?: string
}
