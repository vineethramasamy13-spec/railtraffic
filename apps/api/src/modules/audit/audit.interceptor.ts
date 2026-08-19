import { Injectable, NestInterceptor, ExecutionContext, CallHandler } from '@nestjs/common';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { AuditService } from './audit.service';

@Injectable()
export class AuditInterceptor implements NestInterceptor {
  constructor(private auditService: AuditService) {}

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const req = context.switchToHttp().getRequest();
    const user = req.user;
    
    // Only log mutations
    if (['POST', 'PUT', 'PATCH', 'DELETE'].includes(req.method) && user) {
      return next.handle().pipe(
        tap({
          next: (data) => {
            this.auditService.logAction({
              userId: user.id,
              userEmail: user.email,
              action: `Performed ${req.method} on ${req.url}`,
              resource: req.url,
              changes: { body: req.body, response: data },
              ipAddress: req.ip,
              userAgent: req.headers['user-agent'],
              success: true,
            });
          },
          error: (err) => {
            this.auditService.logAction({
              userId: user.id,
              userEmail: user.email,
              action: `Failed ${req.method} on ${req.url}`,
              resource: req.url,
              changes: { error: err.message },
              ipAddress: req.ip,
              userAgent: req.headers['user-agent'],
              success: false,
            });
          }
        })
      );
    }
    
    return next.handle();
  }
}
