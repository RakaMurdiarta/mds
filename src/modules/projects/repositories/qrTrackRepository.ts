import {
  Inject,
  Injectable,
  UnprocessableEntityException,
} from '@nestjs/common';
import { DBPlainConnection } from '@app/commons/infra/dbPlain/dbPlainConnection';
import { MODULE_OPTIONS_TOKEN } from '@app/commons/infra/dbPlain/dbPlain.moduleDefinition';
import { PoolConnection, PoolOptions, QueryResult } from 'mysql2/promise';
import {
  CreateQrTrackProjectDto,
  CreateQrTrackProjectSchema,
} from '../schemas/createQrTrackProject.schema';
import { UpdateQrTrackProjectDto } from '../schemas/updateQrTrackProject.schema';

@Injectable()
export class QrTrackRepo extends DBPlainConnection {
  private insertStatment: string = 'INSERT INTO';
  private projectTable: string = 'projects';

  constructor(@Inject(MODULE_OPTIONS_TOKEN) options: PoolOptions) {
    super(options);
  }

  async createProject(
    payload: CreateQrTrackProjectDto,
    connection: PoolConnection,
  ) {
    try {
      const columns = Object.keys(CreateQrTrackProjectSchema.shape)
        .filter((key) => key in payload)
        .concat(['created_at', 'updated_at']);

      const values: Array<any> = [];

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

      const parameterized = columns.map(() => '?').join(', ');

      const sql = `${this.insertStatment} ${this.projectTable}(${columns.join(', ')}) VALUES (${parameterized})`;

      await connection.execute(sql, values);
    } catch (error) {
      throw new UnprocessableEntityException(error.message);
    }
  }

  async findById(payload: {
    id: number;
  }): Promise<{ ProjectID: number } | null> {
    try {
      const columns = ['id'].join(',');
      const sql = `SELECT ${columns} FROM projects WHERE id = ? AND deleted_at IS NULL`;

      const connection = await this.connectionPool();
      const row = await connection.execute<SelectResult>(sql, [payload.id]);

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

  async updateProjectById(
    payloads: UpdateQrTrackProjectDto,
    connection: PoolConnection,
  ): Promise<void> {
    try {
      const keys: Array<string> = [];
      const values: Array<string> = [];

      Object.keys(payloads).forEach((key) => {
        if (key === 'id') {
          return;
        }

        if (payloads[key] !== undefined && payloads[key] !== null) {
          keys.push(`${key} = ?`);
          values.push(payloads[key]);
        }
      });

      if (values.length === 0) {
        return;
      }

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
        id = ${payloads.id}
        AND deleted_at IS NULL
        `;

      await connection.execute(sql, values);
    } catch (error) {
      throw new UnprocessableEntityException(error.message);
    }
  }
}

type SelectResult = QueryResult & Array<{ ProjectID: number }>;
