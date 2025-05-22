import { Injectable } from '@nestjs/common';
import { fetchApi } from '../utils/fetcher';
import { EnvService } from '../envs/env.service';

@Injectable()
export class ExOutBoxService {
  constructor(private readonly envService: EnvService) {}

  async deleteStateBox(ids: Array<string>) {
    try {
      await fetchApi({
        url: `${this.envService.get('IPMS_BASE_URL')}/api/integration-outbox`,
        method: 'DELETE',
        config: {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${this.envService.get('IPMS_KEY')}`,
          },
        },
        payload: { ids },
      });
    } catch (error) {
      return;
    }
  }
}
