import { Injectable, NestInterceptor, ExecutionContext, CallHandler } from '@nestjs/common';
import { Observable, map } from 'rxjs';

@Injectable()
export class SuccessResponseInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    return next.handle().pipe(map((data) => ({
      statusCode: context.switchToHttp().getResponse().statusCode,
      response: data
    })));
  }
}
