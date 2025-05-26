import {
  Inject,
  Injectable,
  UnprocessableEntityException,
} from '@nestjs/common';
import { PoolConnection, PoolOptions, QueryResult } from 'mysql2/promise';
import { DBPlainConnection } from '@app/commons/infra/dbPlain/dbPlainConnection';
import { MODULE_OPTIONS_TOKEN } from '@app/commons/infra/dbPlain/dbPlain.moduleDefinition';
import {
  CreateSiaProjectDto,
  CreateSiaProjectSchema,
} from '../schemas/createSiaProject.schema';
import { UpdateSiaProjectDto } from '../schemas/updateSiaProject.schema';

type SelectResult = QueryResult & Array<{ ProjectID: number }>;

@Injectable()
export class SiaRepo extends DBPlainConnection {
  private insertStatment: string = 'INSERT INTO';
  private projectTable: string = 'projects';

  constructor(@Inject(MODULE_OPTIONS_TOKEN) options: PoolOptions) {
    super(options);
  }

  async createSiaProject(
    payload: CreateSiaProjectDto,
    connection: PoolConnection,
  ) {
    try {
      const columns = Object.keys(CreateSiaProjectSchema.shape)
        .filter((key) => key in payload)
        .concat(['created_at', 'updated_at']);

      const values: Array<unknown> = [];

      const mysqlFormattedDate = new Date()
        .toISOString()
        .replace('T', ' ')
        .replace('Z', '')
        .split('.')[0];

      columns.forEach((column) => {
        if (column === 'created_at' || column === 'updated_at') {
          values.push(mysqlFormattedDate);
        } else {
          values.push(payload[column] ?? null);
        }
      });

      if (values.length === 0) {
        return;
      }

      const parameterized = columns.map(() => '?').join(', ');

      const sql = `${this.insertStatment} ${this.projectTable}(${columns.join(', ')}) VALUES (${parameterized})`;

      await connection.execute(sql, values);
    } catch (error) {
      throw new UnprocessableEntityException(error.message);
    }
  }

  async findById(payload: {
    projectId: number;
  }): Promise<{ ProjectID: number } | null> {
    try {
      const columns = ['ProjectID'].join(',');
      const sql = `SELECT ${columns} FROM projects WHERE ProjectID = ? AND deleted_at IS NULL`;

      const connection = await this.connectionPool();
      const row = await connection.execute<SelectResult>(sql, [
        payload.projectId,
      ]);

      let result: { ProjectID: number } | null = null;

      if (row.length <= 0) {
        return null;
      }

      row[0].forEach((e) => {
        result = e;
      });

      return result;
    } catch (error) {
      return null;
    }
  }
  async updateProject(
    payloads: UpdateSiaProjectDto,
    connection: PoolConnection,
  ): Promise<void> {
    try {
      const keys: Array<string> = [];
      const values: Array<string> = [];

      Object.keys(payloads).forEach((key) => {
        if (key === 'ProjectID') {
          return;
        }

        if (payloads[key] !== undefined && payloads[key] !== null) {
          keys.push(`${key} = ?`);
          values.push(payloads[key]);
        }
      });
      const mysqlFormattedDate = new Date()
        .toISOString()
        .replace('T', ' ')
        .replace('Z', '')
        .split('.')[0];

      //store date string on updated at parameterize
      values.push(mysqlFormattedDate);

      const sql = `
      UPDATE ${this.projectTable}
      SET
      ${keys.join(',')}, updated_at = ?
      WHERE
      ProjectID = ${payloads.ProjectID}
      AND deleted_at IS NULL
      `;

      await connection.execute(sql, values);
    } catch (error) {
      throw new UnprocessableEntityException(error.message);
    }
  }
}
