import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { Observable, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';

export type Response<T> = {
  status: boolean;
  statusCode: number;
  path: string;
  message?: string;
  data: T;
  timestamp: string;
};

interface Resp {
  message?: string;
  erorrs?: any[];
  error?: string;
}
@Injectable()
export class ResponseInterceptor<T> implements NestInterceptor<T, Response<T>> {
  intercept(
    context: ExecutionContext,
    next: CallHandler,
  ): Observable<Response<T>> {
    return next.handle().pipe(
      map((res: unknown) => this.responseHandler(res, context)),
      catchError((err: HttpException) =>
        throwError(() => this.errorHandler(err, context)),
      ),
    );
  }

  errorHandler(exception: HttpException, context: ExecutionContext) {
    const ctx = context.switchToHttp();
    const response = ctx.getResponse();
    const request = ctx.getRequest();

    const status =
      exception instanceof HttpException
        ? exception.getStatus()
        : HttpStatus.INTERNAL_SERVER_ERROR;
    if (exception.name === 'QueryFailedError') {
      return response.status(status).json({
        status: false,
        statusCode: status,
        path: request.url,
        message: exception.message,
        timestamp: new Date().toISOString(),
      });
    }

    if (exception.message === 'ValidationError') {
      const resp: string | Resp = exception?.getResponse();
      return response.status(status).json({
        status: false,
        statusCode: status,
        path: request.url,
        message: exception.message,
        ...(typeof resp === 'object' ? resp : {}),
        timestamp: new Date().toISOString(),
      });
    }
    console.log('eraererer', exception.message);
    return response.status(status).json({
      status: false,
      statusCode: status,
      path: request.url,
      message: exception.message,
      result: exception,
      timestamp: new Date().toISOString(),
    });
  }

  responseHandler(res: any, context: ExecutionContext) {
    const ctx = context.switchToHttp();
    const response = ctx.getResponse();
    const request = ctx.getRequest();
    const statusCode = response.statusCode;

    return {
      status: true,
      path: request.url,
      statusCode,
      data: res,
      timestamp: new Date().toISOString(),
    };
  }
}
