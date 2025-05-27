import { Injectable } from '@nestjs/common';
import { CompaniesService } from '@root/modules/companies/services/companies.service';
import { CustomerServices } from '@root/modules/customers/services/customer.service';
import { ProjectService } from '@root/modules/projects/services/project.service';
import { SupplierServices } from '@root/modules/suppliers/services/suppliers.service';
import { EnvService } from '@env/env.service';
import { OuterType } from '@app/commons/utils/externalApi.type';
import { fetchApi } from '@app/commons/utils/fetcher';

@Injectable()
export class PoolingService {
  constructor(
    private readonly companiesServices: CompaniesService,
    private readonly customerServices: CustomerServices,
    private readonly projectServices: ProjectService,
    private readonly supplierServices: SupplierServices,
    private readonly envService: EnvService,
  ) {}

  private async getPoolData(): Promise<Array<OuterType<unknown>>> {
    try {
      const response = await fetchApi<{
        data: Array<OuterType<unknown>>;
      }>({
        url: `${this.envService.get('IPMS_BASE_URL')}/api/integration-outbox?limit=${20}`,
        method: 'GET',
        config: {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${this.envService.get('IPMS_KEY')}`,
          },
        },
      });

      return response.data;
    } catch (error) {
      throw error;
    }
  }
  async runPool(): Promise<void> {
    try {
      const data = await this.getPoolData();

      if (data.length === 0) {
        return;
      }

      for (const d of data) {
        try {
          switch (d.target.toLowerCase()) {
            case 'Company'.toLowerCase(): {
              await this.companiesServices.poolingCompanies(d);

              break;
            }

            case 'Project'.toLowerCase(): {
              await this.projectServices.projectPooling(d);
              break;
            }

            case 'Customer'.toLowerCase(): {
              await this.customerServices.poolingCustomers(d);

              break;
            }
            case 'Supplier'.toLowerCase(): {
              await this.supplierServices.poolingSuppliers(d);

              break;
            }

            default:
              break;
          }
        } catch (error) {
          throw error;
        }
      }
    } catch (error) {
      throw error;
    }
  }
}
