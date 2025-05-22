/* eslint-disable @typescript-eslint/no-unused-vars */
import { Logger, QueryRunner } from 'typeorm';
import { Logger as NestLogger } from '@nestjs/common';

export class QueryDbLogger implements Logger {
  private logger: NestLogger;

  constructor() {
    this.logger = new NestLogger();
  }

  logQuery(query: string, parameters?: any[], queryRunner?: QueryRunner) {
    this.logger.debug(
      `QUERY LOG :: query: ${query} parameters: ${JSON.stringify(parameters)}`,
    );
  }
  logQueryError(
    error: string | Error,
    query: string,
    parameters?: any[],
    queryRunner?: QueryRunner,
  ) {
    this.logger.error(
      `QUERY ERROR :: error: ${error} query: ${query} parameters: ${JSON.stringify(parameters)}`,
    );
  }
  logQuerySlow(
    time: number,
    query: string,
    parameters?: any[],
    queryRunner?: QueryRunner,
  ) {
    this.logger.warn(
      `QUERY SLOW :: time: ${time} query: ${query} parameters: ${JSON.stringify(parameters)}`,
    );
  }
  logSchemaBuild(message: string, queryRunner?: QueryRunner) {
    this.logger.log(`QUERY SCHEMA BUILD :: message: ${message} `);
  }
  logMigration(message: string, queryRunner?: QueryRunner) {
    this.logger.log(`QUERY MIGRATION :: message: ${message} `);
  }
  log(level: 'log' | 'info' | 'warn', message: any, queryRunner?: QueryRunner) {
    this.logger.log(`LOG :: message: ${message} level: ${level}`);
  }
}
