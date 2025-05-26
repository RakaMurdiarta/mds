import { Injectable } from '@nestjs/common';
import { SiaRepo } from '../repositories/siaRepository';
import { QrTrackRepo } from '../repositories/qrTrackRepository';
import { CreateSiaProjectDto } from '../schemas/createSiaProject.schema';
import { CreateQrTrackProjectDto } from '../schemas/createQrTrackProject.schema';
import { UpdateSiaProjectDto } from '../schemas/updateSiaProject.schema';
import { UpdateQrTrackProjectDto } from '../schemas/updateQrTrackProject.schema';

export interface CreateDataSyncDto {
  sia: CreateSiaProjectDto;
  qr_track: CreateQrTrackProjectDto;
}

export interface UpdateDataSyncDto {
  sia: UpdateSiaProjectDto;
  qr_track: UpdateQrTrackProjectDto;
}

@Injectable()
export class ProjectDataSyncService {
  constructor(
    private readonly siaRepo: SiaRepo,
    private readonly qrTrackRepo: QrTrackRepo,
  ) {}

  async createProjectSync(args: CreateDataSyncDto): Promise<void> {
    const siaConneciton = await this.siaRepo.connectionPool();
    const qrTrackConneciton = await this.qrTrackRepo.connectionPool();
    try {
      console.log('TRANSACTION BEGIN');

      await siaConneciton.beginTransaction();
      await qrTrackConneciton.beginTransaction();

      const projectOnSia = await this.siaRepo.findById({
        projectId: args.sia.ProjectID,
      });

      const projectOnQrTrack = await this.qrTrackRepo.findById({
        id: args.qr_track.id,
      });

      if (projectOnSia && projectOnQrTrack) {
        return;
      }

      if (!projectOnSia) {
        await this.siaRepo.createSiaProject(args.sia, siaConneciton);
      }

      if (!projectOnQrTrack) {
        await this.qrTrackRepo.createProject(args.qr_track, qrTrackConneciton);
      }

      await siaConneciton.commit();
      await qrTrackConneciton.commit();
      console.log('TRANSACTION COMMIT');
    } catch (error) {
      await siaConneciton.rollback();
      await qrTrackConneciton.rollback();
      console.log('TRANSACTION ROLLBACK');

      throw error;
    } finally {
      siaConneciton.release();
      qrTrackConneciton.release();
      console.log('CONNECTION RELEASE');
    }
  }

  async updateProjectSync(args: UpdateDataSyncDto): Promise<void> {
    const siaConneciton = await this.siaRepo.connectionPool();
    const qrTrackConneciton = await this.qrTrackRepo.connectionPool();
    try {
      console.log('TRANSACTION BEGIN');

      await siaConneciton.beginTransaction();
      await qrTrackConneciton.beginTransaction();

      const projectOnSia = await this.siaRepo.findById({
        projectId: args.sia.ProjectID,
      });

      const projectOnQrTrack = await this.qrTrackRepo.findById({
        id: args.qr_track.id,
      });

      if (!projectOnSia && !projectOnQrTrack) {
        return;
      }
      if (projectOnSia) {
        await this.siaRepo.updateProject(args.sia, siaConneciton);
      }

      if (projectOnQrTrack) {
        await this.qrTrackRepo.updateProjectById(
          args.qr_track,
          qrTrackConneciton,
        );
      }

      await siaConneciton.commit();
      await qrTrackConneciton.commit();
      console.log('TRANSACTION COMMIT');
    } catch (error) {
      await siaConneciton.rollback();
      await qrTrackConneciton.rollback();
      console.log('TRANSACTION ROLLBACK');

      throw error;
    } finally {
      siaConneciton.release();
      qrTrackConneciton.release();
      console.log('CONNECTION RELEASE');
    }
  }
}
