import { AnalyticsService } from './analytics.service';
export declare class AnalyticsController {
    private readonly service;
    constructor(service: AnalyticsService);
    getSummary(): {
        success: boolean;
        data: {
            totalVehiclesSold: number;
            totalRevenue: number;
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
    };
    getSales(query: any): {
        success: boolean;
        data: {
            period: any;
            totalSold: number;
            totalRevenue: number;
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
    };
    getFinancing(query: any): {
        success: boolean;
        data: {
            totalApplications: number;
            approved: number;
            rejected: number;
            pending: number;
            approvalRate: number;
            averageLoanAmount: number;
            totalFinanced: number;
            byInstitution: {
                name: string;
                approved: number;
                rejected: number;
                avgRate: number;
            }[];
        };
    };
    getPartners(query: any): {
        success: boolean;
        data: {
            totalPartners: number;
            totalCommissions: number;
            topPartners: {
                name: string;
                type: string;
                deals: number;
                commission: number;
                rating: number;
            }[];
        };
    };
    getRevenue(query: any): {
        success: boolean;
        data: {
            totalRevenue: number;
            commissionRevenue: number;
            processingFees: number;
            monthlyRevenue: {
                month: string;
                revenue: number;
                commission: number;
            }[];
        };
    };
    getTrends(query: any): {
        success: boolean;
        data: {
            month: string;
            sales: number;
            revenue: number;
            loans: number;
            leads: number;
        }[];
    };
}
