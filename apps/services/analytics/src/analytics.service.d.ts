import { Repository } from 'typeorm';
import { AnalyticsSnapshot } from './entities/analytics-snapshot.entity';
export declare class AnalyticsService {
    private readonly snapshotRepo;
    constructor(snapshotRepo: Repository<AnalyticsSnapshot>);
    saveSnapshot(data: any): Promise<{
        success: boolean;
        data: any;
    }>;
    getSummary(): Promise<{
        success: boolean;
        data: {
            totalVehiclesSold: number;
            totalRevenue: any;
            totalLoansApproved: number;
            totalLoansRejected: number;
            totalActiveDeals: number;
            totalPartners: number;
            totalLeads: number;
            conversionRate: number;
            averageDealValue: number;
            monthlyTrends: {
                month: string;
                sales: number;
                revenue: number;
                loans: number;
                leads: number;
            }[];
        };
    }>;
    getSales(query?: any): Promise<{
        success: boolean;
        data: {
            period: string;
            totalSold: number;
            totalRevenue: any;
            byMake: {
                make: string;
                count: number;
                revenue: number;
            }[];
            byCondition: {
                condition: string;
                count: number;
                revenue: number;
            }[];
        };
    }>;
    getFinancing(query?: any): Promise<{
        success: boolean;
        data: {
            totalApplications: number;
            approved: number;
            rejected: number;
            pending: number;
            approvalRate: number;
            averageLoanAmount: number;
            totalFinanced: any;
            byInstitution: {
                name: string;
                approved: number;
                rejected: number;
                avgRate: number;
            }[];
        };
    }>;
    getPartnerPerformance(query?: any): Promise<{
        success: boolean;
        data: {
            totalPartners: number;
            totalCommissions: any;
            topPartners: {
                name: any;
                type: any;
                deals: number;
                commission: number;
                commissionRate: number;
                agreements: number;
                status: any;
            }[];
        };
    }>;
    getRevenue(query?: any): Promise<{
        success: boolean;
        data: {
            totalRevenue: any;
            commissionRevenue: any;
            processingFees: any;
            monthlyRevenue: {
                month: string;
                revenue: number;
                commission: number;
            }[];
        };
    }>;
    getTrends(query?: any): Promise<{
        success: boolean;
        data: {
            month: string;
            sales: number;
            revenue: number;
            loans: number;
            leads: number;
        }[];
    }>;
    private loadDataset;
    private fetchCollection;
    private unwrapCollection;
    private buildMonthlyTrends;
    private createMonthBuckets;
    private toBucketKey;
    private normalizeStage;
    private toNumber;
    private getDate;
    private getDealAmount;
    private sumDealRevenue;
    private normalizePeriod;
    private isInPeriod;
    private parseVehicleDescription;
}
