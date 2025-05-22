import { DataSource, DataSourceOptions } from 'typeorm';
import { dbMigrationConfig } from '@config/db/migrationConfig';

const dataSource = new DataSource(dbMigrationConfig() as DataSourceOptions);
export default dataSource;
