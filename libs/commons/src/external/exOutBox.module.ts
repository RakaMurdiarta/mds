import { Module } from '@nestjs/common';
import { ExOutBoxService } from './exOutBox.service';
import { EnvModule } from '../envs/env.module';
import { DeleteOutBoxEventHandler } from '../events/deleteOutBoxEventHandler';
import { DeleteOutBoxSaga } from '../events/deleteOutBoxEventSaga';
import { DeleteOutBoxHandler } from './commands/deleteOutBoxState.handler';

@Module({
  imports: [EnvModule],
  providers: [
    ExOutBoxService,
    DeleteOutBoxEventHandler,
    DeleteOutBoxSaga,
    DeleteOutBoxHandler,
  ],
  exports: [ExOutBoxService],
})
export class ExOutBoxModule {}
