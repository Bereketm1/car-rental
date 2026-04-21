import { Controller, Get, Query, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation } from '@nestjs/swagger';
import { AuthGuard } from '../auth/auth.guard';
import { ProxyService } from '../services/proxy.service';

@ApiTags('search')
@Controller('api/search')
@UseGuards(AuthGuard)
export class SearchController {
  constructor(private readonly proxy: ProxyService) {}

  @Get()
  @ApiOperation({ summary: 'Global search across all main entities' })
  async globalSearch(@Query('q') q: string) {
    if (!q || q.length < 2) {
      return { success: true, data: { customers: [], vehicles: [], deals: [] } };
    }

    const query = q.toLowerCase();

    const [custRes, vehRes, dealRes] = await Promise.all([
      this.proxy.forward('crm', 'GET', '/customers').catch(() => []),
      this.proxy.forward('vehicle', 'GET', '/vehicles').catch(() => []),
      this.proxy.forward('deal', 'GET', '/deals').catch(() => []),
    ]);

    const customers = this.unwrapCollection(custRes).filter((c: any) =>
      (c.firstName || '').toLowerCase().includes(query) ||
      (c.lastName || '').toLowerCase().includes(query) ||
      (c.email || '').toLowerCase().includes(query) ||
      (c.phone || '').includes(query)
    );

    const vehicles = this.unwrapCollection(vehRes).filter((v: any) =>
      (v.make || '').toLowerCase().includes(query) ||
      (v.model || '').toLowerCase().includes(query) ||
      (v.condition || '').toLowerCase().includes(query) ||
      (v.supplierName || '').toLowerCase().includes(query)
    );

    const deals = this.unwrapCollection(dealRes).filter((d: any) =>
      (d.customerName || '').toLowerCase().includes(query) ||
      (d.vehicleDescription || '').toLowerCase().includes(query) ||
      (d.stage || '').toLowerCase().includes(query) ||
      (d.notes || '').toLowerCase().includes(query)
    );

    return {
      success: true,
      data: {
        customers,
        vehicles,
        deals
      }
    };
  }

  private unwrapCollection(payload: any) {
    if (Array.isArray(payload)) {
      return payload;
    }

    if (payload && typeof payload === 'object' && Array.isArray(payload.data)) {
      return payload.data;
    }

    return [];
  }
}
