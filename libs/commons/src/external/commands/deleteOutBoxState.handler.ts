import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { DeleteOutBoxCommand } from './deleteOutBoxState.command';
import { Injectable } from '@nestjs/common';
import { ExOutBoxService } from '../exOutBox.service';

@CommandHandler(DeleteOutBoxCommand)
@Injectable()
export class DeleteOutBoxHandler
  implements ICommandHandler<DeleteOutBoxCommand>
{
  constructor(private readonly exOutBoxService: ExOutBoxService) {}

  async execute(command: DeleteOutBoxCommand): Promise<any> {
    try {
      await this.exOutBoxService.deleteStateBox(command.ids);
    } catch (error) {
      throw error;
    }
  }
}
