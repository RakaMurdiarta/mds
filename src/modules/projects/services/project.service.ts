import { InjectQueue } from '@nestjs/bullmq';
import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import {
  CREATE_PROJECT_SYNC_JOB_NAME,
  PROJECT_SYNC_QUEUE_NAME,
} from '../queue/queue.constants';
import { Queue } from 'bullmq';
import { ProjectRepository } from '../repositories/projectRepository';
import { EnvService } from '@app/commons/envs/env.service';
import { fetchApi } from '@app/commons/utils/fetcher';
import { OuterType } from '@app/commons/utils/externalApi.type';
import {
  CreateProjectDto,
  createProjectSchema,
} from '../schemas/createProject.schema';
import { TYPE_IDENTIFIER } from '@app/commons/types/typeIdentifier.type';
import { zodParseSchema } from '@app/commons/utils/zodFilterParse';
// import {
//   UpdateProjectDto,
//   updateProjectSchema,
// } from '../schemas/updateProject.schema';
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

  private async createProject(arg: CreateProjectDto) {
    try {
      const company = await this.companyRepo.findBy({
        where: {
          companyId: arg.companyId,
        },
      });

      if (!company) {
        throw new NotFoundException('company not found');
      }

      const project = await this.projectRepo.findBy({
        where: {
          projectId: arg.projectId,
          name: arg.name,
        },
      });
      const cmd = new CreateProjectCommand(
        arg.name,
        arg.projectType,
        arg.status,
        company.id,
        arg.number,
        arg.projectId,
      );

      if (!project) {
        await this.commandBus.execute(cmd);
      }

      const uuid = uuid_v7();
      const rnd = genRandomString();
      const __uuid = `${uuid}${JobDelimeter}${rnd}`;

      await this.queue.add(`${CREATE_PROJECT_SYNC_JOB_NAME}`, cmd, {
        jobId: __uuid,
        attempts: MAX_ATTEMPTS,
        backoff: RetryConfig,
        removeOnComplete: true,
        removeOnFail: {
          age: JOB_TTL,
        },
      });
    } catch (error) {
      throw error;
    }
  }
  //   async updateProject(arg: UpdateProjectDto) {}

  async projectPooling(args: { type: TYPE_IDENTIFIER }) {
    try {
      const projects = await fetchApi<{
        data: Array<OuterType<CreateProjectDto>>;
      }>({
        url: `${this.envService.get('IPMS_BASE_URL')}/api/integration-outbox?limit=${20}&target=${args.type.toLowerCase()}`,
        method: 'GET',
        config: {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${this.envService.get('IPMS_KEY')}`,
          },
        },
      });

      if (projects.data.length === 0) {
        return;
      }

      await Promise.all(
        projects.data.map(async (data) => {
          switch (data.operation) {
            case 'create': {
              const parse = zodParseSchema<CreateProjectDto>(
                createProjectSchema,
                data.payload,
              );

              await this.createProject(parse);
              break;
            }

            case 'update': {
              //   const parse = zodParseSchema<UpdateProjectDto>(
              //     updateProjectSchema,
              //     data.payload,
              //   );

              //   await this.updateProject(parse);
              break;
            }

            default:
              break;
          }
        }),
      );
    } catch (error) {
      throw error;
    }
  }
}
