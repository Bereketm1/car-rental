import { NestInterceptor, ExecutionContext, CallHandler } from '@nestjs/common';
import { Observable } from 'rxjs';
import { ProxyService } from '../services/proxy.service';
export declare class AuditInterceptor implements NestInterceptor {
    private readonly proxy;
    constructor(proxy: ProxyService);
    intercept(context: ExecutionContext, next: CallHandler): Observable<any>;
    private logAction;
    private extractResource;
    private buildNotification;
    private describeAction;
    private humanizeResource;
}
