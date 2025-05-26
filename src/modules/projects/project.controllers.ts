import { Controller, Get } from '@nestjs/common';
import { ProjectService } from './services/project.service';
import { ResponseMessage } from '@app/commons/api/responseMessage.decorator';
import { ApiResponse } from '@app/commons/api/baseResponse';

@Controller('projects')
export class ProjectControllers {
  constructor(private readonly projectService: ProjectService) {}
  @ResponseMessage('projects pooling triggered')
  @Get()
  async execPoolProjects(): Promise<ApiResponse<void>> {
    await this.projectService.projectPooling({ type: 'Project' });
    return {
      data: null,
    };
  }
}
