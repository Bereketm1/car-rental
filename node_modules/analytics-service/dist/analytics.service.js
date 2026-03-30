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
Object.defineProperty(exports, "__esModule", { value: true });
exports.AnalyticsService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const analytics_snapshot_entity_1 = require("./entities/analytics-snapshot.entity");
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
    getSummary() {
        return {
            success: true,
            data: {
                totalVehiclesSold: 127,
                totalRevenue: 285000000,
                totalLoansApproved: 98,
                totalLoansRejected: 23,
                totalActiveDeals: 34,
                totalPartners: 15,
                totalLeads: 256,
                conversionRate: 38.2,
                averageDealValue: 2800000,
                monthlyTrends: this.getMonthlyTrends(),
            },
        };
    }
    getSales(query) {
        return {
            success: true,
            data: {
                period: query?.period || 'month',
                totalSold: 127,
                totalRevenue: 285000000,
                byMake: [
                    { make: 'Toyota', count: 45, revenue: 89000000 },
                    { make: 'Hyundai', count: 28, revenue: 72000000 },
                    { make: 'Suzuki', count: 22, revenue: 48000000 },
                    { make: 'Nissan', count: 18, revenue: 45000000 },
                    { make: 'Others', count: 14, revenue: 31000000 },
                ],
                byCondition: [
                    { condition: 'new', count: 78, revenue: 195000000 },
                    { condition: 'used', count: 35, revenue: 56000000 },
                    { condition: 'certified', count: 14, revenue: 34000000 },
                ],
            },
        };
    }
    getFinancing(query) {
        return {
            success: true,
            data: {
                totalApplications: 156,
                approved: 98,
                rejected: 23,
                pending: 35,
                approvalRate: 62.8,
                averageLoanAmount: 2300000,
                totalFinanced: 225400000,
                byInstitution: [
                    { name: 'Commercial Bank of Ethiopia', approved: 42, rejected: 8, avgRate: 14.5 },
                    { name: 'Awash Bank', approved: 31, rejected: 9, avgRate: 16.2 },
                    { name: 'Dashen Bank', approved: 25, rejected: 6, avgRate: 15.1 },
                ],
            },
        };
    }
    getPartnerPerformance(query) {
        return {
            success: true,
            data: {
                totalPartners: 15,
                totalCommissions: 12500000,
                topPartners: [
                    { name: 'Nyala Motors', type: 'supplier', deals: 34, commission: 3400000, rating: 4.8 },
                    { name: 'Holland Car', type: 'supplier', deals: 28, commission: 2800000, rating: 4.5 },
                    { name: 'Commercial Bank of Ethiopia', type: 'financial_institution', deals: 42, commission: 2100000, rating: 4.7 },
                    { name: 'Awash Bank', type: 'financial_institution', deals: 31, commission: 1860000, rating: 4.3 },
                    { name: 'Dashen Bank', type: 'financial_institution', deals: 25, commission: 1500000, rating: 4.4 },
                ],
            },
        };
    }
    getRevenue(query) {
        return {
            success: true,
            data: {
                totalRevenue: 285000000,
                commissionRevenue: 12500000,
                processingFees: 4200000,
                monthlyRevenue: [
                    { month: 'Jan', revenue: 32000000, commission: 1400000 },
                    { month: 'Feb', revenue: 28000000, commission: 1200000 },
                    { month: 'Mar', revenue: 35000000, commission: 1500000 },
                    { month: 'Apr', revenue: 31000000, commission: 1350000 },
                    { month: 'May', revenue: 38000000, commission: 1600000 },
                    { month: 'Jun', revenue: 42000000, commission: 1800000 },
                    { month: 'Jul', revenue: 29000000, commission: 1250000 },
                    { month: 'Aug', revenue: 25000000, commission: 1100000 },
                    { month: 'Sep', revenue: 33000000, commission: 1450000 },
                    { month: 'Oct', revenue: 36000000, commission: 1550000 },
                    { month: 'Nov', revenue: 40000000, commission: 1700000 },
                    { month: 'Dec', revenue: 45000000, commission: 1950000 },
                ],
            },
        };
    }
    getMonthlyTrends() {
        return [
            { month: 'Jan', sales: 10, revenue: 32000000, loans: 12, leads: 20 },
            { month: 'Feb', sales: 8, revenue: 28000000, loans: 10, leads: 18 },
            { month: 'Mar', sales: 12, revenue: 35000000, loans: 15, leads: 25 },
            { month: 'Apr', sales: 11, revenue: 31000000, loans: 13, leads: 22 },
            { month: 'May', sales: 14, revenue: 38000000, loans: 16, leads: 28 },
            { month: 'Jun', sales: 16, revenue: 42000000, loans: 18, leads: 32 },
            { month: 'Jul', sales: 9, revenue: 29000000, loans: 11, leads: 19 },
            { month: 'Aug', sales: 7, revenue: 25000000, loans: 9, leads: 16 },
            { month: 'Sep', sales: 11, revenue: 33000000, loans: 14, leads: 24 },
            { month: 'Oct', sales: 13, revenue: 36000000, loans: 15, leads: 27 },
            { month: 'Nov', sales: 15, revenue: 40000000, loans: 17, leads: 30 },
            { month: 'Dec', sales: 18, revenue: 45000000, loans: 20, leads: 35 },
        ];
    }
    getTrends(query) {
        return { success: true, data: this.getMonthlyTrends() };
    }
};
exports.AnalyticsService = AnalyticsService;
exports.AnalyticsService = AnalyticsService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(analytics_snapshot_entity_1.AnalyticsSnapshot)),
    __metadata("design:paramtypes", [typeorm_2.Repository])
], AnalyticsService);
//# sourceMappingURL=analytics.service.js.map