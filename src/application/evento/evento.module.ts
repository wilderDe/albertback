import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import { Evento } from './entity/evento.entity'
import { Categoria } from './entity/categoria.entity'
import { Participantes } from './entity/participantes.entity'
import { Item } from './entity/item.entity'
import { CategoriaController } from './controller/categoria.controller'
import { CategoriaService } from './service/categoria.service'
import { CategoriaRepository } from './repository/categoria.repository'
import { EventoController } from './controller/evento.controller'
import { EventoService } from './service/evento.service'
import { EventoRepository } from './repository/evento.repository'
import { ItemController } from './controller/item.controller'
import { ItemService } from './service/item.service'
import { ItemRepository } from './repository/item.reposiroty'
import { ParticipanteController } from './controller/participantes.controller'
import { ParticipanteService } from './service/participantes.service'
import { ParticipanteRepository } from './repository/participante.repository'
import { Usuario } from 'src/core/usuario/entity/usuario.entity'

@Module({
  controllers: [
    CategoriaController,
    EventoController,
    ItemController,
    ParticipanteController,
  ],
  providers: [
    CategoriaService,
    CategoriaRepository,
    EventoService,
    EventoRepository,
    ItemService,
    ItemRepository,
    ParticipanteService,
    ParticipanteRepository,
  ],
  imports: [
    TypeOrmModule.forFeature([Evento, Categoria, Participantes, Item, Usuario]),
  ],
})
export class EventoModule {}
