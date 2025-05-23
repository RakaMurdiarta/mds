import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryColumn,
  Unique,
} from 'typeorm';
import { BaseSchemaUUID } from '@app/commons/entities/baseEntitiesHelper';
import { BigIntTransformer } from '@app/commons/entities/transform/bigInt.transform';
import { CompaniesEntity } from '../companies/companies.entity';

@Entity({ name: ProjectEntity.tableName })
@Unique('uq_project_name', ['name'])
@Unique('uq_project_project_id', ['projectId'])
export class ProjectEntity extends BaseSchemaUUID {
  static tableName = 'projects';

  @PrimaryColumn({
    type: 'bigint',
    name: 'project_id',
    transformer: new BigIntTransformer(),
  })
  projectId: number;

  @Column({ type: 'varchar' })
  name: string;

  @Column({ type: 'varchar', name: 'project_type', nullable: true })
  projectType?: string;

  @Column({ type: 'varchar', nullable: true })
  number?: string;

  @Column({ type: 'varchar', nullable: true })
  status?: string;

  @ManyToOne(() => CompaniesEntity, (c) => c.projects, {
    onDelete: 'CASCADE',
    nullable: false,
  })
  @JoinColumn({ name: 'company_id' })
  company: CompaniesEntity;
}
