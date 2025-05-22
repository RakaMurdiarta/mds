/* eslint-disable @typescript-eslint/no-unused-vars */
import { Injectable } from '@nestjs/common';
import { ICommand, ofType, Saga } from '@nestjs/cqrs';
import { catchError, map, Observable, of } from 'rxjs';
import { DeleteOutBoxEvent } from './deleteOutBoxEvent';
import { DeleteOutBoxCommand } from '../external/commands/deleteOutBoxState.command';

@Injectable()
export class DeleteOutBoxSaga {
  constructor() {}
  @Saga()
  deletedBoxState = (events$: Observable<any>): Observable<ICommand> => {
    return events$.pipe(
      ofType(DeleteOutBoxEvent),
      map((event) => {
        return new DeleteOutBoxCommand(event.ids);
      }),
      catchError((err) => {
        return of();
      }),
    );
  };
}
