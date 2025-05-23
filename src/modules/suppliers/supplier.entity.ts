import { Column, Entity, Index, Unique } from 'typeorm';
import { BaseSchemaUUID } from '@app/commons/entities/baseEntitiesHelper';

@Entity({ name: SuppliersEntity.tableName })
@Unique('uq_Suppliers_supplier_id', ['supplierId'])
@Index('idx_Suppliers_supplier_id', ['supplierId'], {
  unique: true,
})
export class SuppliersEntity extends BaseSchemaUUID {
  static tableName = 'suppliers';

  @Column({
    type: 'varchar',
    name: 'supplier_id',
  })
  supplierId: string;

  @Column({ type: 'varchar' })
  name: string;
}
