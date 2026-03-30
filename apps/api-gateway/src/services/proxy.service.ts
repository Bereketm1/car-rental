import { Injectable, HttpException } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { firstValueFrom } from 'rxjs';

@Injectable()
export class ProxyService {
  private readonly serviceUrls: Record<string, string> = {
    crm: process.env.CRM_SERVICE_URL || 'http://localhost:3001',
    vehicle: process.env.VEHICLE_SERVICE_URL || 'http://localhost:3002',
    finance: process.env.FINANCE_SERVICE_URL || 'http://localhost:3003',
    deal: process.env.DEAL_SERVICE_URL || 'http://localhost:3004',
    partner: process.env.PARTNER_SERVICE_URL || 'http://localhost:3005',
    lead: process.env.LEAD_SERVICE_URL || 'http://localhost:3006',
    analytics: process.env.ANALYTICS_SERVICE_URL || 'http://localhost:3007',
  };

  constructor(private readonly httpService: HttpService) {}

  async forward(service: string, method: string, path: string, body?: any, query?: any) {
    const baseUrl = this.serviceUrls[service];
    if (!baseUrl) {
      throw new HttpException(`Service ${service} not found`, 404);
    }

    try {
      const url = `${baseUrl}${path}`;
      const response: any = await firstValueFrom(
        this.httpService.request({
          method,
          url,
          data: body,
          params: query,
          timeout: 10000,
        }),
      );
      return response.data;
    } catch (error: any) {
      if (error.response) {
        throw new HttpException(error.response.data, error.response.status);
      }
      throw new HttpException(`Service ${service} unavailable`, 503);
    }
  }
}
