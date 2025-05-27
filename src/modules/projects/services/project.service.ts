import { InjectQueue } from '@nestjs/bullmq';
import { Inject, Injectable } from '@nestjs/common';
import {
  CREATE_PROJECT_SYNC_JOB_NAME,
  PROJECT_SYNC_QUEUE_NAME,
  UPDATE_PROJECT_SYNC_JOB_NAME,
} from '../queue/queue.constants';
import { Queue } from 'bullmq';
import { ProjectRepository } from '../repositories/projectRepository';
import { EnvService } from '@app/commons/envs/env.service';
import { OuterType } from '@app/commons/utils/externalApi.type';
import {
  CreateProjectDto,
  createProjectSchema,
} from '../schemas/createProject.schema';
import { zodParseSchema } from '@app/commons/utils/zodFilterParse';
import {
  UpdateProjectDto,
  updateProjectSchema,
} from '../schemas/updateProject.schema';
import { CompaniesRepository } from '../../companies/repositories/companiesRepository';
import { CreateProjectCommand } from '../commands/createProject.command';
import { CommandBus } from '@nestjs/cqrs';
import { v7 as uuid_v7 } from 'uuid';
import { Redis } from 'ioredis';
import { REDIS_CLIENT } from '@app/commons/infra/redis/redisUseFactory';
import { JobDelimeter } from '@app/commons/queues/constants/job.delimeter';
import { genRandomString } from '@app/commons/utils/genRandom';
import { MAX_ATTEMPTS } from '../queue/attemps';
import { RetryConfig } from '@app/commons/queues/config/retryConfig';
import { JOB_TTL } from '../queue/ttl';
import { UpdateProjectCommand } from '../commands/updateProject.command';

@Injectable()
export class ProjectService {
  constructor(
    @InjectQueue(PROJECT_SYNC_QUEUE_NAME)
    private readonly queue: Queue,
    private readonly projectRepo: ProjectRepository,
    private readonly envService: EnvService,
    private readonly companyRepo: CompaniesRepository,
    private readonly commandBus: CommandBus,
    @Inject(REDIS_CLIENT) private redis: Redis,
  ) {}

  private async createProject(arg: CreateProjectDto, outboxId: string) {
    try {
      const company = await this.companyRepo.findBy({
        where: {
          companyId: arg.companyId,
        },
      });

      const project = await this.projectRepo.findBy({
        where: {
          projectId: arg.projectId,
          name: arg.name,
        },
      });

      if (!project && company) {
        const cmd = new CreateProjectCommand(
          arg.name,
          arg.projectType,
          arg.status,
          company.id,
          arg.number,
          arg.projectId,
        );
        await this.commandBus.execute(cmd);
      }

      if (company) {
        const uuid = uuid_v7();
        const rnd = genRandomString();
        const __uuid = `${uuid}${JobDelimeter}${rnd}`;

        //setex redis
        await this.redis.setex(__uuid, JOB_TTL, outboxId);

        const cmd = new CreateProjectCommand(
          arg.name,
          arg.projectType,
          arg.status,
          company.id,
          arg.number,
          arg.projectId,
        );

        await this.queue.add(
          `${CREATE_PROJECT_SYNC_JOB_NAME}`,
          { ...cmd, companyId: company.companyId },
          {
            jobId: __uuid,
            attempts: MAX_ATTEMPTS,
            backoff: RetryConfig,
            removeOnComplete: true,
            removeOnFail: {
              age: JOB_TTL,
            },
          },
        );
      }
    } catch (error) {
      throw error;
    }
  }
  private async updateProject(arg: UpdateProjectDto, outboxId: string) {
    try {
      const project = await this.projectRepo.findBy({
        where: {
          projectId: arg.projectId,
        },
      });

      const company = await this.companyRepo.findBy({
        where: {
          companyId: arg.companyId,
        },
      });

      if (project && company) {
        const cmd = new UpdateProjectCommand(
          arg.projectId,
          arg.name,
          arg.projectType,
          arg.status,
          company.id,
          arg.number,
        );
        await this.commandBus.execute(cmd);
      }

      if (company) {
        const uuid = uuid_v7();
        const rnd = genRandomString();
        const __uuid = `${uuid}${JobDelimeter}${rnd}`;
        await this.redis.setex(__uuid, JOB_TTL, outboxId);
        const cmd = new UpdateProjectCommand(
          arg.projectId,
          arg.name,
          arg.projectType,
          arg.status,
          company.id,
          arg.number,
        );

        await this.queue.add(
          `${UPDATE_PROJECT_SYNC_JOB_NAME}`,
          { ...cmd, companyId: company.companyId },
          {
            jobId: __uuid,
            attempts: MAX_ATTEMPTS,
            backoff: RetryConfig,
            removeOnComplete: true,
            removeOnFail: {
              age: JOB_TTL,
            },
          },
        );
      }
    } catch (error) {
      throw error;
    }
  }

  async projectPooling(data: OuterType<unknown>) {
    try {
      switch (data.operation) {
        case 'create': {
          const parse = zodParseSchema<CreateProjectDto>(
            createProjectSchema,
            data.payload,
          );

          await this.createProject(parse, data.id);
          break;
        }

        case 'update': {
          const parse = zodParseSchema<UpdateProjectDto>(
            updateProjectSchema,
            data.payload,
          );

          await this.updateProject(parse, data.id);
          break;
        }

        default:
          break;
      }
    } catch (error) {
      throw error;
    }
  }
}
