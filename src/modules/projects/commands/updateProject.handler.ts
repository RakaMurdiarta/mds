import { DbTxService } from '@app/commons/dbTransaction/dbTx.service';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { ProjectRepository } from '../repositories/projectRepository';
import { Injectable } from '@nestjs/common';
import { UpdateProjectCommand } from './updateProject.command';
import { Not } from 'typeorm';

@CommandHandler(UpdateProjectCommand)
@Injectable()
export class UpdateProjectHandler
  implements ICommandHandler<UpdateProjectCommand>
{
  constructor(
    private __tx: DbTxService,
    private projectRepo: ProjectRepository,
  ) {}

  async execute(command: UpdateProjectCommand): Promise<any> {
    try {
      const getProjectById = await this.projectRepo.findBy({
        where: {
          projectId: Not(command.projectId),
          name: command.name,
        },
        relations: {
          company: true,
        },
      });

      if (getProjectById) {
        return;
      }

      await this.__tx.withTx(async (manager) => {
        return await this.projectRepo.updateProject(
          command,
          getProjectById,
          manager,
        );
      });
    } catch (error) {
      throw error;
    }
  }
}
