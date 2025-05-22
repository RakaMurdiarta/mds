import { IEvent } from '@nestjs/cqrs';

export class DeleteOutBoxEvent implements IEvent {
  constructor(public ids: Array<string>) {}
}
