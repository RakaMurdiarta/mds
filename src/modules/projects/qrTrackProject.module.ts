import { Module } from '@nestjs/common';
import { DatabasePlainModule } from '@app/commons/infra/dbPlain/dbPlain.module';
import { EnvService } from '@env/env.service';
import { QrTrackRepo } from './repositories/qrTrackRepository';

@Module({
  imports: [
    DatabasePlainModule.registerAsync({
      useFactory: (env: EnvService) => {
        return {
          host: env.get('DB_QR_TRACK_HOST'),
          user: env.get('DB_QR_TRACK_USER'),
          password: env.get('DB_QR_TRACK_PWD'),
          database: env.get('DB_QR_TRACK_NAME'),
          waitForConnections: true,
          connectionLimit: 50,
          queueLimit: 100,
          port: env.get('DB_QR_TRACK_PORT'),
        };
      },
      inject: [EnvService],
    }),
  ],
  providers: [QrTrackRepo],
  exports: [QrTrackRepo],
})
export class QrTrackModule {}
