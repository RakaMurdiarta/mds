import { DbTxService } from '@app/commons/dbTransaction/dbTx.service';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { CreateProjectCommand } from './createProject.command';
import { ProjectRepository } from '../repositories/projectRepository';
import { ConflictException, Injectable } from '@nestjs/common';

@CommandHandler(CreateProjectCommand)
@Injectable()
export class CreateProjectHandler
  implements ICommandHandler<CreateProjectCommand>
{
  constructor(
    private __tx: DbTxService,
    private projectRepo: ProjectRepository,
  ) {}

  async execute(command: CreateProjectCommand): Promise<void> {
    try {
      await this.__tx.withTx(async (manager) => {
        const getProjectById = await this.projectRepo.findBy({
          where: {
            projectId: command.projectId,
            name: command.name,
          },
        });

        if (getProjectById) {
          throw new ConflictException('project already exist');
        }

        return await this.projectRepo.createProject(command, manager);
      });
    } catch (error) {
      throw error;
    }
  }
}
