import { Module } from '@nestjs/common'
import { ParametroModule } from './parametro/parametro.module'
import { EventoModule } from './evento/evento.module'

@Module({
  imports: [ParametroModule, EventoModule],
})
export class ApplicationModule {}
