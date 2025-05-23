import { Column, Entity, Index, Unique } from 'typeorm';
import { BaseSchemaUUID } from '@app/commons/entities/baseEntitiesHelper';

@Entity({ name: CustomersEntity.tableName })
@Unique('uq_Customer_customer_id', ['customerId'])
@Index('idx_Customer_customer_id', ['customerId'], {
  unique: true,
})
export class CustomersEntity extends BaseSchemaUUID {
  static tableName = 'customers';

  @Column({
    type: 'varchar',
    name: 'customer_id',
  })
  customerId: string;

  @Column({ type: 'varchar' })
  name: string;
}
