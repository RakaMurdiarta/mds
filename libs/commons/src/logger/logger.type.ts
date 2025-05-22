/* eslint-disable @typescript-eslint/no-unused-vars */
const ErrolLevel = 'error';
type ErrolLevel = 'error';

const DebugLevel = 'debug';
type DebugLevel = 'debug';

const InfoLevel = 'info';
type InfoLevel = 'info';

const WarnLevel = 'warn';
type WarnLevel = 'warn';

export type LogLevel = ErrolLevel | DebugLevel | InfoLevel | WarnLevel;
