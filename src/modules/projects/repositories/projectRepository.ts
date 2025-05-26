import { Injectable, UnprocessableEntityException } from '@nestjs/common';
import { BaseRepository } from '@app/commons/utils/baseRepository';
import { ProjectEntity } from '../project.entity';
import { DataSource, EntityManager, FindOneOptions } from 'typeorm';
import { CreateProjectCommand } from '../commands/createProject.command';
import { UpdateProjectCommand } from '../commands/updateProject.command';

@Injectable()
export class ProjectRepository extends BaseRepository<ProjectEntity> {
  constructor(private ds: DataSource) {
    super(ds, ProjectEntity);
  }

  async findBy(where: FindOneOptions<ProjectEntity>) {
    return await this.repo.findOne(where);
  }

  async createProject(cmd: CreateProjectCommand, manager?: EntityManager) {
    try {
      if (manager) {
        const project = manager.create(ProjectEntity, {
          ...cmd,
          company: {
            id: cmd.companyId,
          },
        });

        const projectSave = await manager.save(project);

        return projectSave;
      }

      const project = this.repo.create({
        ...cmd,
        company: {
          id: cmd.companyId,
        },
      });

      const projectSave = await this.repo.save(project);

      return projectSave;
    } catch (error) {
      throw new UnprocessableEntityException(error.message);
    }
  }

  async updateProject(
    cmd: UpdateProjectCommand,
    project: ProjectEntity,
    manager?: EntityManager,
  ): Promise<ProjectEntity> {
    try {
      Object.keys(cmd).forEach((key) => {
        if (key === 'projectId') {
          return;
        }

        if (cmd[key] !== undefined && cmd[key] !== null) {
          if (key == 'companyId') {
            project.company.id = cmd[key];
          }
          project[key] = cmd[key];
        }
      });

      if (manager) {
        await manager.save(project);
        return;
      }

      await this.repo.save(project);

      return project;
    } catch (error) {
      throw new UnprocessableEntityException(error.message);
    }
  }
}
