import { Injectable, NestInterceptor, ExecutionContext, CallHandler } from '@nestjs/common';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { ProxyService } from '../services/proxy.service';

@Injectable()
export class AuditInterceptor implements NestInterceptor {
  constructor(private readonly proxy: ProxyService) {}

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const request = context.switchToHttp().getRequest();
    const { method, url, body, user } = request;

    // Only log mutating requests
    if (['POST', 'PUT', 'DELETE', 'PATCH'].includes(method)) {
      return next.handle().pipe(
        tap({
          next: (data) => {
            // Asynchronous logging to CRM audit-log
            this.logAction(method, url, body, user, data);
          },
        }),
      );
    }

    return next.handle();
  }

  private async logAction(method: string, url: string, body: any, user: any, response: any) {
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
    } catch (e: any) {
      // Fail silently for audit logs to avoid breaking the main request
      console.error('Audit Logging failed:', e.message);
    }
  }
}
