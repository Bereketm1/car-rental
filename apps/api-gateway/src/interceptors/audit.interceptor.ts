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
    } catch (e: any) {
      console.error('Audit Logging failed:', e.message);
    }
  }

  private extractResource(url: string) {
    const segments = url.split('?')[0].split('/').filter(Boolean);
    return segments[1] || segments[0] || 'unknown';
  }

  private buildNotification(method: string, resource: string, user: any, response: any) {
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

  private describeAction(method: string, resource: string) {
    if (method === 'POST') {
      return 'Created';
    }

    if (method === 'DELETE') {
      return resource === 'deals' ? 'Cancelled' : 'Removed';
    }

    return 'Updated';
  }

  private humanizeResource(resource: string) {
    const spaced = resource.replace(/[-_]+/g, ' ').trim();
    const singular = spaced.endsWith('s') ? spaced.slice(0, -1) : spaced;
    return singular.replace(/\b\w/g, (match) => match.toUpperCase());
  }
}
