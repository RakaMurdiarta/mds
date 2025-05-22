import { TYPE_IDENTIFIER } from '../types/typeIdentifier.type';

export type OuterType<Payload> = {
  id: string;
  target: TYPE_IDENTIFIER;
  operation: 'update' | 'create';
  payload: Payload;
};
