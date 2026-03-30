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
    
    // Fetch all for MVP in-memory search across microservices
    const [custRes, vehRes, dealRes] = await Promise.all([
      this.proxy.forward('crm', 'GET', '/customers').catch(() => ({ data: [] })),
      this.proxy.forward('vehicle', 'GET', '/vehicles').catch(() => ({ data: [] })),
      this.proxy.forward('deal', 'GET', '/deals').catch(() => ({ data: [] })),
    ]);

    const customers = (custRes.data || []).filter((c: any) => 
      (c.firstName || '').toLowerCase().includes(query) || 
      (c.lastName || '').toLowerCase().includes(query) ||
      (c.email || '').toLowerCase().includes(query) ||
      (c.phone || '').includes(query)
    );

    const vehicles = (vehRes.data || []).filter((v: any) =>
      (v.make || '').toLowerCase().includes(query) ||
      (v.model || '').toLowerCase().includes(query) ||
      (v.trim || '').toLowerCase().includes(query) ||
      (v.condition || '').toLowerCase().includes(query)
    );

    const deals = (dealRes.data || []).filter((d: any) =>
      (d.customerName || '').toLowerCase().includes(query) ||
      (d.vehicleDescription || '').toLowerCase().includes(query) ||
      (d.stage || '').toLowerCase().includes(query)
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
}
