import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { AnalyticsSnapshot } from './entities/analytics-snapshot.entity';

const SERVICE_URLS: Record<string, string> = {
  crm: process.env.CRM_SERVICE_URL || 'http://localhost:3001',
  vehicle: process.env.VEHICLE_SERVICE_URL || 'http://localhost:3002',
  finance: process.env.FINANCE_SERVICE_URL || 'http://localhost:3003',
  deal: process.env.DEAL_SERVICE_URL || 'http://localhost:3004',
  partner: process.env.PARTNER_SERVICE_URL || 'http://localhost:3005',
  lead: process.env.LEAD_SERVICE_URL || 'http://localhost:3006',
};

type AnalyticsDataset = {
  customers: any[];
  vehicles: any[];
  deals: any[];
  loanApplications: any[];
  reviews: any[];
  institutions: any[];
  partners: any[];
  commissions: any[];
  agreements: any[];
  campaigns: any[];
  leads: any[];
  referrals: any[];
};

@Injectable()
export class AnalyticsService {
  constructor(
    @InjectRepository(AnalyticsSnapshot)
    private readonly snapshotRepo: Repository<AnalyticsSnapshot>,
  ) {}

  async saveSnapshot(data: any) {
    const snapshot = this.snapshotRepo.create({
      snapshotDate: new Date(),
      data,
    });
    await this.snapshotRepo.save(snapshot);
    return { success: true, data: snapshot };
  }

  async getSummary() {
    const dataset = await this.loadDataset();
    const completedDeals = dataset.deals.filter((deal) => this.normalizeStage(deal.stage) === 'completed');
    const soldVehicles = dataset.vehicles.filter((vehicle) => this.normalizeStage(vehicle.status) === 'sold').length;
    const approvedReviews = dataset.reviews.filter((review) => this.normalizeStage(review.status) === 'approved');
    const rejectedReviews = dataset.reviews.filter((review) => this.normalizeStage(review.status) === 'rejected');
    const activeDeals = dataset.deals.filter((deal) => !['completed', 'cancelled'].includes(this.normalizeStage(deal.stage)));
    const convertedLeads = dataset.leads.filter((lead) => this.normalizeStage(lead.status) === 'converted').length;
    const totalRevenue = this.sumDealRevenue(completedDeals);
    const totalVehiclesSold = Math.max(completedDeals.length, soldVehicles);
    const conversionRate = dataset.leads.length ? (convertedLeads / dataset.leads.length) * 100 : 0;
    const averageDealValue = completedDeals.length ? totalRevenue / completedDeals.length : 0;

    return {
      success: true,
      data: {
        totalVehiclesSold,
        totalRevenue,
        totalLoansApproved: approvedReviews.length,
        totalLoansRejected: rejectedReviews.length,
        totalActiveDeals: activeDeals.length,
        totalPartners: dataset.partners.length,
        totalLeads: dataset.leads.length,
        conversionRate,
        averageDealValue,
        monthlyTrends: this.buildMonthlyTrends(dataset),
      },
    };
  }

  async getSales(query?: any) {
    const dataset = await this.loadDataset();
    const period = this.normalizePeriod(query?.period);
    const vehiclesById = Object.fromEntries(dataset.vehicles.map((vehicle) => [vehicle.id, vehicle]));
    const completedDeals = dataset.deals.filter((deal) => this.normalizeStage(deal.stage) === 'completed');
    const periodDeals = completedDeals.filter((deal) => this.isInPeriod(this.getDate(deal.createdAt), period));

    const byMakeMap = new Map<string, { make: string; count: number; revenue: number }>();
    const byConditionMap = new Map<string, { condition: string; count: number; revenue: number }>();

    for (const deal of periodDeals) {
      const vehicle = deal.vehicleId ? vehiclesById[deal.vehicleId] : undefined;
      const amount = this.getDealAmount(deal);
      const make = String(vehicle?.make || this.parseVehicleDescription(deal.vehicleDescription).make || 'Unknown');
      const condition = String(vehicle?.condition || 'unknown').toLowerCase();

      const makeRow = byMakeMap.get(make) || { make, count: 0, revenue: 0 };
      makeRow.count += 1;
      makeRow.revenue += amount;
      byMakeMap.set(make, makeRow);

      const conditionRow = byConditionMap.get(condition) || { condition, count: 0, revenue: 0 };
      conditionRow.count += 1;
      conditionRow.revenue += amount;
      byConditionMap.set(condition, conditionRow);
    }

    return {
      success: true,
      data: {
        period,
        totalSold: periodDeals.length,
        totalRevenue: this.sumDealRevenue(periodDeals),
        byMake: [...byMakeMap.values()].sort((left, right) => right.count - left.count),
        byCondition: [...byConditionMap.values()].sort((left, right) => right.count - left.count),
      },
    };
  }

  async getFinancing(query?: any) {
    const dataset = await this.loadDataset();
    const approvedRows = dataset.reviews.filter((row) => this.normalizeStage(row.status) === 'approved');
    const rejectedRows = dataset.reviews.filter((row) => this.normalizeStage(row.status) === 'rejected');
    const pendingRows = dataset.reviews.filter((row) => ['pending', 'in_review', 'more_info_needed'].includes(this.normalizeStage(row.status)));
    const totalApplications = dataset.loanApplications.length || dataset.reviews.length;
    const approvalRate = totalApplications ? (approvedRows.length / totalApplications) * 100 : 0;
    const totalFinanced = approvedRows.reduce((sum, row) => sum + this.toNumber(row.approvedAmount || row.requestedAmount), 0);
    const averageLoanAmount = approvedRows.length ? totalFinanced / approvedRows.length : 0;
    const institutionsById = Object.fromEntries(dataset.institutions.map((institution) => [institution.id, institution]));
    const institutionMap = new Map<string, { name: string; approved: number; rejected: number; avgRateAccumulator: number; rateCount: number }>();

    for (const review of dataset.reviews) {
      const key = String(review.institutionId || review.institution || 'unassigned');
      const institutionName = review.institution || institutionsById[review.institutionId]?.name || 'Unassigned';
      const status = this.normalizeStage(review.status);
      const existing = institutionMap.get(key) || {
        name: institutionName,
        approved: 0,
        rejected: 0,
        avgRateAccumulator: 0,
        rateCount: 0,
      };

      if (status === 'approved') {
        existing.approved += 1;
      } else if (status === 'rejected') {
        existing.rejected += 1;
      }

      const rate = this.toNumber(review.interestRate);
      if (rate > 0) {
        existing.avgRateAccumulator += rate;
        existing.rateCount += 1;
      }

      institutionMap.set(key, existing);
    }

    return {
      success: true,
      data: {
        totalApplications,
        approved: approvedRows.length,
        rejected: rejectedRows.length,
        pending: pendingRows.length,
        approvalRate,
        averageLoanAmount,
        totalFinanced,
        byInstitution: [...institutionMap.values()]
          .map((row) => ({
            name: row.name,
            approved: row.approved,
            rejected: row.rejected,
            avgRate: row.rateCount ? row.avgRateAccumulator / row.rateCount : 0,
          }))
          .sort((left, right) => right.approved - left.approved),
      },
    };
  }

  async getPartnerPerformance(query?: any) {
    const dataset = await this.loadDataset();
    const commissionsByPartner = new Map<string, { deals: Set<string>; commission: number }>();
    const agreementsByPartner = new Map<string, number>();

    for (const entry of dataset.commissions) {
      const partnerId = String(entry.partnerId || 'unassigned');
      const row = commissionsByPartner.get(partnerId) || { deals: new Set<string>(), commission: 0 };
      if (entry.dealId) {
        row.deals.add(String(entry.dealId));
      }
      row.commission += this.toNumber(entry.amount);
      commissionsByPartner.set(partnerId, row);
    }

    for (const agreement of dataset.agreements) {
      const partnerId = String(agreement.partnerId || 'unassigned');
      agreementsByPartner.set(partnerId, (agreementsByPartner.get(partnerId) || 0) + 1);
    }

    return {
      success: true,
      data: {
        totalPartners: dataset.partners.length,
        totalCommissions: dataset.commissions.reduce((sum, row) => sum + this.toNumber(row.amount), 0),
        topPartners: dataset.partners
          .map((partner) => {
            const rollup = commissionsByPartner.get(String(partner.id)) || { deals: new Set<string>(), commission: 0 };
            return {
              name: partner.name || 'Unnamed partner',
              type: partner.type || 'partner',
              deals: rollup.deals.size,
              commission: rollup.commission,
              commissionRate: this.toNumber(partner.commissionRate),
              agreements: agreementsByPartner.get(String(partner.id)) || 0,
              status: partner.status || 'active',
            };
          })
          .sort((left, right) => {
            if (right.commission !== left.commission) {
              return right.commission - left.commission;
            }
            return right.deals - left.deals;
          })
          .slice(0, 10),
      },
    };
  }

  async getRevenue(query?: any) {
    const dataset = await this.loadDataset();
    const completedDeals = dataset.deals.filter((deal) => this.normalizeStage(deal.stage) === 'completed');
    const totalRevenue = this.sumDealRevenue(completedDeals);
    const commissionRevenue = dataset.commissions.reduce((sum, row) => sum + this.toNumber(row.amount), 0);
    const processingFees = dataset.reviews
      .filter((review) => this.normalizeStage(review.status) === 'approved')
      .reduce((sum, review) => sum + this.toNumber(review.approvedAmount || 0) * 0.01, 0);
    const buckets = this.createMonthBuckets(12);
    const revenueByBucket = new Map<string, { month: string; revenue: number; commission: number }>();

    for (const bucket of buckets) {
      revenueByBucket.set(bucket.key, { month: bucket.label, revenue: 0, commission: 0 });
    }

    for (const deal of completedDeals) {
      const key = this.toBucketKey(this.getDate(deal.createdAt));
      const current = key ? revenueByBucket.get(key) : undefined;
      if (current) {
        current.revenue += this.getDealAmount(deal);
      }
    }

    for (const commission of dataset.commissions) {
      const key = this.toBucketKey(this.getDate(commission.createdAt));
      const current = key ? revenueByBucket.get(key) : undefined;
      if (current) {
        current.commission += this.toNumber(commission.amount);
      }
    }

    return {
      success: true,
      data: {
        totalRevenue,
        commissionRevenue,
        processingFees,
        monthlyRevenue: [...revenueByBucket.values()],
      },
    };
  }

  async getTrends(query?: any) {
    const dataset = await this.loadDataset();
    return { success: true, data: this.buildMonthlyTrends(dataset) };
  }

  private async loadDataset(): Promise<AnalyticsDataset> {
    const [customers, vehicles, deals, loanApplications, reviews, institutions, partners, agreements, campaigns, leads, referrals] = await Promise.all([
      this.fetchCollection('crm', '/customers'),
      this.fetchCollection('vehicle', '/vehicles'),
      this.fetchCollection('deal', '/deals'),
      this.fetchCollection('crm', '/loan-applications'),
      this.fetchCollection('finance', '/reviews'),
      this.fetchCollection('finance', '/institutions'),
      this.fetchCollection('partner', '/partners'),
      this.fetchCollection('partner', '/agreements'),
      this.fetchCollection('lead', '/campaigns'),
      this.fetchCollection('lead', '/leads'),
      this.fetchCollection('lead', '/referrals'),
    ]);

    const commissionLists = await Promise.all(
      partners.map((partner) => this.fetchCollection('partner', `/partners/${partner.id}/commissions`)),
    );

    return {
      customers,
      vehicles,
      deals,
      loanApplications,
      reviews,
      institutions,
      partners,
      commissions: commissionLists.flat(),
      agreements,
      campaigns,
      leads,
      referrals,
    };
  }

  private async fetchCollection(service: string, path: string): Promise<any[]> {
    const baseUrl = SERVICE_URLS[service];
    const url = `${baseUrl}${path}`;

    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 6000);
      const response = await fetch(url, { signal: controller.signal });
      clearTimeout(timeoutId);

      if (!response.ok) {
        return [];
      }

      const payload = await response.json();
      return this.unwrapCollection(payload);
    } catch {
      return [];
    }
  }

  private unwrapCollection(payload: any): any[] {
    if (Array.isArray(payload)) {
      return payload;
    }

    if (payload && typeof payload === 'object') {
      if (Array.isArray(payload.data)) {
        return payload.data;
      }

      if (payload.data && typeof payload.data === 'object' && Array.isArray(payload.data.items)) {
        return payload.data.items;
      }
    }

    return [];
  }

  private buildMonthlyTrends(dataset: AnalyticsDataset) {
    const buckets = this.createMonthBuckets(12);
    const trendMap = new Map<string, { month: string; sales: number; revenue: number; loans: number; leads: number }>();

    for (const bucket of buckets) {
      trendMap.set(bucket.key, {
        month: bucket.label,
        sales: 0,
        revenue: 0,
        loans: 0,
        leads: 0,
      });
    }

    for (const deal of dataset.deals) {
      if (this.normalizeStage(deal.stage) !== 'completed') {
        continue;
      }

      const key = this.toBucketKey(this.getDate(deal.createdAt));
      const row = key ? trendMap.get(key) : undefined;
      if (row) {
        row.sales += 1;
        row.revenue += this.getDealAmount(deal);
      }
    }

    for (const review of dataset.reviews) {
      if (this.normalizeStage(review.status) !== 'approved') {
        continue;
      }

      const key = this.toBucketKey(this.getDate(review.createdAt));
      const row = key ? trendMap.get(key) : undefined;
      if (row) {
        row.loans += 1;
      }
    }

    for (const lead of dataset.leads) {
      const key = this.toBucketKey(this.getDate(lead.createdAt));
      const row = key ? trendMap.get(key) : undefined;
      if (row) {
        row.leads += 1;
      }
    }

    return [...trendMap.values()];
  }

  private createMonthBuckets(monthCount: number) {
    const now = new Date();
    const buckets: Array<{ key: string; label: string; date: Date }> = [];

    for (let index = monthCount - 1; index >= 0; index -= 1) {
      const date = new Date(now.getFullYear(), now.getMonth() - index, 1);
      buckets.push({
        key: this.toBucketKey(date) || '',
        label: date.toLocaleString('en-US', { month: 'short' }),
        date,
      });
    }

    return buckets;
  }

  private toBucketKey(date: Date | null) {
    if (!date) {
      return null;
    }

    return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
  }

  private normalizeStage(value: any) {
    return String(value || '').trim().toLowerCase().replace(/\s+/g, '_');
  }

  private toNumber(value: any) {
    const parsed = Number(value);
    return Number.isFinite(parsed) ? parsed : 0;
  }

  private getDate(value: any) {
    if (!value) {
      return null;
    }

    const parsed = new Date(value);
    return Number.isNaN(parsed.getTime()) ? null : parsed;
  }

  private getDealAmount(deal: any) {
    return this.toNumber(deal.totalAmount || deal.amount || 0);
  }

  private sumDealRevenue(deals: any[]) {
    return deals.reduce((sum, deal) => sum + this.getDealAmount(deal), 0);
  }

  private normalizePeriod(value: any) {
    const period = String(value || 'month').toLowerCase();
    if (period === 'week' || period === 'quarter' || period === 'year') {
      return period;
    }
    return 'month';
  }

  private isInPeriod(date: Date | null, period: string) {
    if (!date) {
      return false;
    }

    const now = new Date();
    const start = new Date(now);

    if (period === 'week') {
      start.setDate(now.getDate() - 7);
    } else if (period === 'month') {
      start.setMonth(now.getMonth() - 1);
    } else if (period === 'quarter') {
      start.setMonth(now.getMonth() - 3);
    } else {
      start.setFullYear(now.getFullYear() - 1);
    }

    return date >= start;
  }

  private parseVehicleDescription(value: any) {
    const description = String(value || '').trim();
    if (!description) {
      return { make: '' };
    }

    const [make] = description.split(' ');
    return { make };
  }
}
