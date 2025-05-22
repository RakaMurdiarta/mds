import { Module } from '@nestjs/common';
import { DbTxService } from './dbTx.service';

@Module({
  exports: [DbTxService],
  providers: [DbTxService],
})
export class DBTransactionModule {}
