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
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuditInterceptor = void 0;
const common_1 = require("@nestjs/common");
const operators_1 = require("rxjs/operators");
const proxy_service_1 = require("../services/proxy.service");
let AuditInterceptor = class AuditInterceptor {
    constructor(proxy) {
        this.proxy = proxy;
    }
    intercept(context, next) {
        const request = context.switchToHttp().getRequest();
        const { method, url, body, user } = request;
        // Only log mutating requests
        if (['POST', 'PUT', 'DELETE', 'PATCH'].includes(method)) {
            return next.handle().pipe((0, operators_1.tap)({
                next: (data) => {
                    // Asynchronous logging to CRM audit-log
                    this.logAction(method, url, body, user, data);
                },
            }));
        }
        return next.handle();
    }
    async logAction(method, url, body, user, response) {
        try {
            const resource = url.split('/')[2]; // e.g., /api/customers -> customers
            const action = `${method} ${url}`;
            const logData = {
                userId: user?.sub,
                action,
                resource: resource || 'unknown',
                resourceId: response?.data?.id || body?.id || null,
                payload: {
                    request: body,
                    response: response,
                },
            };
            // Forward to CRM service via ProxyService
            await this.proxy.forward('crm', 'POST', '/audit-logs', logData);
        }
        catch (e) {
            // Fail silently for audit logs to avoid breaking the main request
            console.error('Audit Logging failed:', e.message);
        }
    }
};
exports.AuditInterceptor = AuditInterceptor;
exports.AuditInterceptor = AuditInterceptor = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [proxy_service_1.ProxyService])
], AuditInterceptor);
