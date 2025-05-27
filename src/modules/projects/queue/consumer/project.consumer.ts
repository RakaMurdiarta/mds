import { OnWorkerEvent, Processor, WorkerHost } from '@nestjs/bullmq';
import {
  PROJECT_SYNC_QUEUE_NAME,
  PROJECT_TYPE_JOB_KEY,
} from '../queue.constants';
import { Inject, Injectable } from '@nestjs/common';
import { Job } from 'bullmq';
import {
  CreateDataSyncDto,
  ProjectDataSyncService,
  UpdateDataSyncDto,
} from '@root/modules/projects/services/projectDataSync.service';
import { UpdateProjectCommand } from '@root/modules/projects/commands/updateProject.command';
import { CreateProjectCommand } from '@root/modules/projects/commands/createProject.command';
import { CreateSiaProjectDto } from '@root/modules/projects/schemas/createSiaProject.schema';
import { CreateQrTrackProjectDto } from '@root/modules/projects/schemas/createQrTrackProject.schema';
import { EventBus } from '@nestjs/cqrs';
import { DeleteOutBoxEvent } from '@app/commons/events/deleteOutBoxEvent';
import { REDIS_CLIENT } from '@app/commons/infra/redis/redisUseFactory';
import { Redis } from 'ioredis';

@Processor(PROJECT_SYNC_QUEUE_NAME)
@Injectable()
export class ProjectConsumer extends WorkerHost {
  constructor(
    private readonly projectDataSyncService: ProjectDataSyncService,
    private readonly eventBus: EventBus,
    @Inject(REDIS_CLIENT)
    private readonly redis: Redis,
  ) {
    super();
  }
  async process(
    job: Job<
      CreateProjectCommand | UpdateProjectCommand,
      any,
      PROJECT_TYPE_JOB_KEY
    >,
  ): Promise<any> {
    try {
      switch (job.name) {
        case 'create___project_sync_job': {
          const siaDto: CreateSiaProjectDto = {
            CompanyID: job.data.companyId,
            Number: job.data.number,
            Name: job.data.name,
            ProjectStatus: job.data.status,
            UserText4: job.data.projectType,
            ProjectID: job.data.projectId,
            Udf_PS: '',
          };

          const qrTrackDto: CreateQrTrackProjectDto = {
            id: job.data.projectId,
            name: job.data.name,
            sector_type: job.data.projectType,
          };

          const dto: CreateDataSyncDto = {
            sia: siaDto,
            qr_track: qrTrackDto,
          };

          await this.projectDataSyncService.createProjectSync(dto);
          break;
        }
        case 'update___project_sync_job': {
          const siaDto = {
            CompanyID: job.data.companyId,
            Number: job.data.number,
            Name: job.data.name,
            ProjectStatus: job.data.status,
            UserText4: job.data.projectType,
            ProjectID: job.data.projectId,
            Udf_PS: '',
          };
          const qrTrackDto = {
            name: job.data.name,
            sector_type: job.data.projectType,
            id: job.data.projectId,
          };
          const dto: UpdateDataSyncDto = {
            sia: siaDto,
            qr_track: qrTrackDto,
          };

          await this.projectDataSyncService.updateProjectSync(dto);
          break;
        }
        default:
          break;
      }
    } catch (error) {
      console.log(error);
      throw error;
    }
  }
  @OnWorkerEvent('completed')
  async onCompleted(job: Job) {
    const id = (await this.redis.get(job.id)) ?? '';
    await this.eventBus.publish(new DeleteOutBoxEvent([id]));
  }
}
