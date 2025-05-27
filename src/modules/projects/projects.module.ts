import { Module } from '@nestjs/common';
import { SiaModule } from './siaProject.module';
import { QrTrackModule } from './qrTrackProject.module';
import { ProjectDataSyncService } from './services/projectDataSync.service';
import { ProjectService } from './services/project.service';
import { BullMqQueue } from '@app/commons/queues/providers/bullmq/bullmq.module';
import { PROJECT_SYNC_QUEUE_NAME } from './queue/queue.constants';
import { ProjectRepository } from './repositories/projectRepository';
import { EnvModule } from '@app/commons/envs/env.module';
import { CqrsModule } from '@nestjs/cqrs';
import { ProjectControllers } from './project.controllers';
import { CompaniesModule } from '../companies/companies.module';
import { RedisModule } from '@app/commons/infra/redis/redis.mdule';
import { CreateProjectHandler } from './commands/createProject.handler';
import { DBTransactionModule } from '@app/commons/dbTransaction/dbTx.module';
import { ProjectConsumer } from './queue/consumer/project.consumer';
import { UpdateProjectHandler } from './commands/updateProject.handler';
import { ExOutBoxModule } from '@app/commons/external/exOutBox.module';

@Module({
  imports: [
    SiaModule,
    QrTrackModule,
    BullMqQueue.register({
      queues: [PROJECT_SYNC_QUEUE_NAME],
    }),
    EnvModule,
    CqrsModule,
    CompaniesModule,
    RedisModule,
    DBTransactionModule,
    ExOutBoxModule,
  ],
  providers: [
    ProjectDataSyncService,
    ProjectService,
    ProjectRepository,
    CreateProjectHandler,
    UpdateProjectHandler,
    ProjectConsumer,
  ],
  controllers: [ProjectControllers],
  exports: [ProjectService],
})
export class ProjectsModule {}
