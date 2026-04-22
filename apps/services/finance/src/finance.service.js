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
var _a, _b, _c, _d;
Object.defineProperty(exports, "__esModule", { value: true });
exports.FinanceService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const loan_review_entity_1 = require("./entities/loan-review.entity");
const financial_institution_entity_1 = require("./entities/financial-institution.entity");
const document_request_entity_1 = require("./entities/document-request.entity");
const axios_1 = require("@nestjs/axios");
const rxjs_1 = require("rxjs");
let FinanceService = class FinanceService {
    constructor(reviewRepo, institutionRepo, requestRepo, httpService) {
        this.reviewRepo = reviewRepo;
        this.institutionRepo = institutionRepo;
        this.requestRepo = requestRepo;
        this.httpService = httpService;
    }
    // Reviews
    async findAllReviews(query) {
        let where = {};
        if (query?.status)
            where.status = query.status;
        const [data, total] = await this.reviewRepo.findAndCount({
            where,
            relations: ['institutionRef', 'documentRequests'],
            order: { createdAt: 'DESC' },
        });
        return { success: true, data, total };
    }
    async findOneReview(id) {
        const review = await this.reviewRepo.findOne({
            where: { id },
            relations: ['institutionRef', 'documentRequests'],
        });
        if (!review)
            throw new common_1.NotFoundException('Review not found');
        return { success: true, data: review };
    }
    async createReview(dto) {
        const review = this.reviewRepo.create({
            ...dto,
            status: 'pending',
        });
        const saved = await this.reviewRepo.save(review);
        return { success: true, data: saved };
    }
    async updateReview(id, dto) {
        const review = await this.reviewRepo.findOne({ where: { id } });
        if (!review)
            throw new common_1.NotFoundException('Review not found');
        Object.assign(review, dto);
        const saved = await this.reviewRepo.save(review);
        return { success: true, data: saved };
    }
    async approveReview(id, dto) {
        const res = await this.updateReview(id, { ...dto, status: 'approved' });
        // Automation: Update Deal stage to 'approved'
        const review = res.data;
        if (review.dealId) {
            const dealUrl = process.env.DEAL_SERVICE_URL || 'http://localhost:3004';
            try {
                await (0, rxjs_1.firstValueFrom)(this.httpService.put(`${dealUrl}/deals/${review.dealId}/stage`, { stage: 'approved' }));
            }
            catch (e) {
                const message = e instanceof Error ? e.message : String(e);
                console.error('Failed to auto-update deal stage', message);
            }
        }
        return res;
    }
    async rejectReview(id, dto) {
        return this.updateReview(id, { ...dto, status: 'rejected' });
    }
    // Document Requests
    async createDocumentRequest(dto) {
        const req = this.requestRepo.create({
            ...dto,
            status: 'requested',
        });
        const saved = await this.requestRepo.save(req);
        return { success: true, data: saved };
    }
    // Institutions
    async findAllInstitutions() {
        const [data, total] = await this.institutionRepo.findAndCount({
            order: { createdAt: 'ASC' },
        });
        return { success: true, data, total };
    }
    async createInstitution(dto) {
        const inst = this.institutionRepo.create({
            ...dto,
            status: 'active',
        });
        const saved = await this.institutionRepo.save(inst);
        return { success: true, data: saved };
    }
    // Pipeline
    async getPipeline() {
        const [total, pending, inReview, approved, rejected, moreInfoNeeded] = await Promise.all([
            this.reviewRepo.count(),
            this.reviewRepo.count({ where: { status: 'pending' } }),
            this.reviewRepo.count({ where: { status: 'in_review' } }),
            this.reviewRepo.count({ where: { status: 'approved' } }),
            this.reviewRepo.count({ where: { status: 'rejected' } }),
            this.reviewRepo.count({ where: { status: 'more_info_needed' } }),
        ]);
        const pipeline = {
            pending,
            inReview,
            approved,
            rejected,
            moreInfoNeeded,
            total,
        };
        return { success: true, data: pipeline };
    }
};
exports.FinanceService = FinanceService;
exports.FinanceService = FinanceService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(loan_review_entity_1.LoanReview)),
    __param(1, (0, typeorm_1.InjectRepository)(financial_institution_entity_1.FinancialInstitution)),
    __param(2, (0, typeorm_1.InjectRepository)(document_request_entity_1.DocumentRequest)),
    __metadata("design:paramtypes", [typeof (_a = typeof typeorm_2.Repository !== "undefined" && typeorm_2.Repository) === "function" ? _a : Object, typeof (_b = typeof typeorm_2.Repository !== "undefined" && typeorm_2.Repository) === "function" ? _b : Object, typeof (_c = typeof typeorm_2.Repository !== "undefined" && typeorm_2.Repository) === "function" ? _c : Object, typeof (_d = typeof axios_1.HttpService !== "undefined" && axios_1.HttpService) === "function" ? _d : Object])
], FinanceService);
