import {
  BaseEntity,
  BeforeInsert,
  CreateDateColumn,
  DeleteDateColumn,
  PrimaryColumn,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

import { v7 as UUID_v7 } from 'uuid';

export abstract class BaseTimestamp extends BaseEntity {
  @CreateDateColumn({ name: 'created_at', type: 'timestamp with time zone' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at', type: 'timestamp with time zone' })
  updatedAt: Date;

  @DeleteDateColumn({
    name: 'deleted_at',
    nullable: true,
    type: 'timestamp with time zone',
  })
  deletedAt: Date;
}

export abstract class BaseSchemaUUID extends BaseTimestamp {
  @PrimaryColumn('uuid')
  id: string;

  @BeforeInsert()
  _assignId() {
    this.id = UUID_v7();
  }
}

export abstract class BaseSchemaSerial extends BaseTimestamp {
  @PrimaryGeneratedColumn()
  id: number;
}
