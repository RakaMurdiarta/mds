import { Injectable } from '@nestjs/common';
import { EventsHandler, IEventHandler } from '@nestjs/cqrs';
import { DeleteOutBoxEvent } from './deleteOutBoxEvent';

@EventsHandler(DeleteOutBoxEvent)
@Injectable()
export class DeleteOutBoxEventHandler
  implements IEventHandler<DeleteOutBoxEvent>
{
  constructor() {}

  async handle(event: DeleteOutBoxEvent) {
    console.log(`DELETE STATES WITH IDS = ${event.ids}`);
  }
}
