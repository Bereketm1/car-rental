"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
var _a;
Object.defineProperty(exports, "__esModule", { value: true });
exports.AnalyticsService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const analytics_snapshot_entity_1 = require("./entities/analytics-snapshot.entity");
const SERVICE_URLS = {
    crm: process.env.CRM_SERVICE_URL || 'http://localhost:3001',
    vehicle: process.env.VEHICLE_SERVICE_URL || 'http://localhost:3002',
    finance: process.env.FINANCE_SERVICE_URL || 'http://localhost:3003',
    deal: process.env.DEAL_SERVICE_URL || 'http://localhost:3004',
    partner: process.env.PARTNER_SERVICE_URL || 'http://localhost:3005',
    lead: process.env.LEAD_SERVICE_URL || 'http://localhost:3006',
};
let AnalyticsService = class AnalyticsService {
    constructor(snapshotRepo) {
        this.snapshotRepo = snapshotRepo;
    }
    async saveSnapshot(data) {
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
    async getSales(query) {
        const dataset = await this.loadDataset();
        const period = this.normalizePeriod(query?.period);
        const vehiclesById = Object.fromEntries(dataset.vehicles.map((vehicle) => [vehicle.id, vehicle]));
        const completedDeals = dataset.deals.filter((deal) => this.normalizeStage(deal.stage) === 'completed');
        const periodDeals = completedDeals.filter((deal) => this.isInPeriod(this.getDate(deal.createdAt), period));
        const byMakeMap = new Map();
        const byConditionMap = new Map();
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
    async getFinancing(query) {
        const dataset = await this.loadDataset();
        const approvedRows = dataset.reviews.filter((row) => this.normalizeStage(row.status) === 'approved');
        const rejectedRows = dataset.reviews.filter((row) => this.normalizeStage(row.status) === 'rejected');
        const pendingRows = dataset.reviews.filter((row) => ['pending', 'in_review', 'more_info_needed'].includes(this.normalizeStage(row.status)));
        const totalApplications = dataset.loanApplications.length || dataset.reviews.length;
        const approvalRate = totalApplications ? (approvedRows.length / totalApplications) * 100 : 0;
        const totalFinanced = approvedRows.reduce((sum, row) => sum + this.toNumber(row.approvedAmount || row.requestedAmount), 0);
        const averageLoanAmount = approvedRows.length ? totalFinanced / approvedRows.length : 0;
        const institutionsById = Object.fromEntries(dataset.institutions.map((institution) => [institution.id, institution]));
        const institutionMap = new Map();
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
            }
            else if (status === 'rejected') {
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
    async getPartnerPerformance(query) {
        const dataset = await this.loadDataset();
        const commissionsByPartner = new Map();
        const agreementsByPartner = new Map();
        for (const entry of dataset.commissions) {
            const partnerId = String(entry.partnerId || 'unassigned');
            const row = commissionsByPartner.get(partnerId) || { deals: new Set(), commission: 0 };
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
                    const rollup = commissionsByPartner.get(String(partner.id)) || { deals: new Set(), commission: 0 };
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
    async getRevenue(query) {
        const dataset = await this.loadDataset();
        const completedDeals = dataset.deals.filter((deal) => this.normalizeStage(deal.stage) === 'completed');
        const totalRevenue = this.sumDealRevenue(completedDeals);
        const commissionRevenue = dataset.commissions.reduce((sum, row) => sum + this.toNumber(row.amount), 0);
        const processingFees = dataset.reviews
            .filter((review) => this.normalizeStage(review.status) === 'approved')
            .reduce((sum, review) => sum + this.toNumber(review.approvedAmount || 0) * 0.01, 0);
        const buckets = this.createMonthBuckets(12);
        const revenueByBucket = new Map();
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
    async getTrends(query) {
        const dataset = await this.loadDataset();
        return { success: true, data: this.buildMonthlyTrends(dataset) };
    }
    async loadDataset() {
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
        const commissionLists = await Promise.all(partners.map((partner) => this.fetchCollection('partner', `/partners/${partner.id}/commissions`)));
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
    async fetchCollection(service, path) {
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
        }
        catch {
            return [];
        }
    }
    unwrapCollection(payload) {
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
    buildMonthlyTrends(dataset) {
        const buckets = this.createMonthBuckets(12);
        const trendMap = new Map();
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
    createMonthBuckets(monthCount) {
        const now = new Date();
        const buckets = [];
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
    toBucketKey(date) {
        if (!date) {
            return null;
        }
        return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
    }
    normalizeStage(value) {
        return String(value || '').trim().toLowerCase().replace(/\s+/g, '_');
    }
    toNumber(value) {
        const parsed = Number(value);
        return Number.isFinite(parsed) ? parsed : 0;
    }
    getDate(value) {
        if (!value) {
            return null;
        }
        const parsed = new Date(value);
        return Number.isNaN(parsed.getTime()) ? null : parsed;
    }
    getDealAmount(deal) {
        return this.toNumber(deal.totalAmount || deal.amount || 0);
    }
    sumDealRevenue(deals) {
        return deals.reduce((sum, deal) => sum + this.getDealAmount(deal), 0);
    }
    normalizePeriod(value) {
        const period = String(value || 'month').toLowerCase();
        if (period === 'week' || period === 'quarter' || period === 'year') {
            return period;
        }
        return 'month';
    }
    isInPeriod(date, period) {
        if (!date) {
            return false;
        }
        const now = new Date();
        const start = new Date(now);
        if (period === 'week') {
            start.setDate(now.getDate() - 7);
        }
        else if (period === 'month') {
            start.setMonth(now.getMonth() - 1);
        }
        else if (period === 'quarter') {
            start.setMonth(now.getMonth() - 3);
        }
        else {
            start.setFullYear(now.getFullYear() - 1);
        }
        return date >= start;
    }
    parseVehicleDescription(value) {
        const description = String(value || '').trim();
        if (!description) {
            return { make: '' };
        }
        const [make] = description.split(' ');
        return { make };
    }
};
exports.AnalyticsService = AnalyticsService;
exports.AnalyticsService = AnalyticsService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(analytics_snapshot_entity_1.AnalyticsSnapshot)),
    __metadata("design:paramtypes", [typeof (_a = typeof typeorm_2.Repository !== "undefined" && typeorm_2.Repository) === "function" ? _a : Object])
], AnalyticsService);
