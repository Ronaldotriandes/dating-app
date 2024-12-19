import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpStatus,
} from '@nestjs/common';
import { QueryFailedError } from 'typeorm';
import { Response } from 'express';

interface QuertErr extends QueryFailedError {
  driverError: any;
}
@Catch(QueryFailedError)
export class QueryFailedExceptionFilter implements ExceptionFilter {
  catch(exception: QuertErr, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();

    let status = HttpStatus.INTERNAL_SERVER_ERROR;
    let message = 'Database query failed';
    console.log(exception.driverError.code);
    // Handle specific error codes
    switch (exception.driverError.code) {
      case 'ER_DUP_ENTRY':
        status = HttpStatus.BAD_REQUEST;
        message = 'Duplicate entry, email already exists';
        break;
      case 'ER_NO_DEFAULT_FOR_FIELD':
        status = HttpStatus.BAD_REQUEST;
        message = exception.message;
        break;
      case 'ER_BAD_FIELD_ERROR':
        status = HttpStatus.BAD_REQUEST;
        message = 'Invalid field name';
        break;
      // Add more cases as needed
    }

    response.status(status).json({
      statusCode: status,
      message,
      timestamp: new Date().toISOString(),
    });
  }
}
