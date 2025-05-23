import { Column, Entity, Index, OneToMany, Unique } from 'typeorm';
import { BaseSchemaUUID } from '@app/commons/entities/baseEntitiesHelper';
import { ProjectEntity } from '../projects/project.entity';

@Entity({ name: CompaniesEntity.tableName })
@Unique('uq_Companies_company_id', ['companyId'])
@Index('idx_Companies_company_id', ['companyId'], {
  unique: true,
})
export class CompaniesEntity extends BaseSchemaUUID {
  static tableName = 'companies';

  @Column({
    type: 'varchar',
    name: 'company_id',
  })
  companyId: string;

  @Column({ type: 'varchar' })
  name: string;

  @OneToMany(() => ProjectEntity, (p) => p.company, { nullable: false })
  projects: Array<ProjectEntity>;
}
