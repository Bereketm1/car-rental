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
var _a;
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
            const resource = this.extractResource(url);
            const action = `${method} ${url.split('?')[0]}`;
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
            const notification = this.buildNotification(method, resource, user, response);
            await Promise.allSettled([
                this.proxy.forward('crm', 'POST', '/audit-logs', logData),
                notification ? this.proxy.forward('crm', 'POST', '/notifications', notification) : Promise.resolve(null),
            ]);
        }
        catch (e) {
            console.error('Audit Logging failed:', e.message);
        }
    }
    extractResource(url) {
        const segments = url.split('?')[0].split('/').filter(Boolean);
        return segments[1] || segments[0] || 'unknown';
    }
    buildNotification(method, resource, user, response) {
        if (!resource || ['auth', 'notifications', 'audit', 'search'].includes(resource)) {
            return null;
        }
        const actionLabel = this.describeAction(method, resource);
        const resourceLabel = this.humanizeResource(resource);
        const actor = user?.username || user?.role || 'System';
        const entityId = response?.data?.id ? ` (${String(response.data.id).slice(0, 8)})` : '';
        return {
            recipientId: user?.sub ? String(user.sub) : 'workspace',
            title: `${resourceLabel} ${actionLabel}`,
            message: `${actor} ${actionLabel.toLowerCase()} ${resourceLabel.toLowerCase()}${entityId}.`,
            type: method === 'DELETE' ? 'warning' : 'info',
        };
    }
    describeAction(method, resource) {
        if (method === 'POST') {
            return 'Created';
        }
        if (method === 'DELETE') {
            return resource === 'deals' ? 'Cancelled' : 'Removed';
        }
        return 'Updated';
    }
    humanizeResource(resource) {
        const spaced = resource.replace(/[-_]+/g, ' ').trim();
        const singular = spaced.endsWith('s') ? spaced.slice(0, -1) : spaced;
        return singular.replace(/\b\w/g, (match) => match.toUpperCase());
    }
};
exports.AuditInterceptor = AuditInterceptor;
exports.AuditInterceptor = AuditInterceptor = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [typeof (_a = typeof proxy_service_1.ProxyService !== "undefined" && proxy_service_1.ProxyService) === "function" ? _a : Object])
], AuditInterceptor);
