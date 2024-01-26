import {
  Catch,
  Logger,
  HttpStatus,
  HttpException,
  ArgumentsHost,
  ExceptionFilter,
  NotFoundException,
} from '@nestjs/common';
import { Response } from 'express';
import { I18nContext } from 'nestjs-i18n';
import { EntityNotFoundError } from 'typeorm';
import { CommonErrorCodes } from '@/common/errors';

@Catch()
export class AllExceptionsFilter implements ExceptionFilter {
  private readonly i18nCommonErrorsFile = 'common-errors';
  private readonly logger = new Logger('ExceptionHandler');

  async catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const i18n = I18nContext.current(host);
    const response = ctx.getResponse<Response>();

    let code: string;
    let message: string;
    let statusCode: HttpStatus;

    if (
      exception instanceof NotFoundException ||
      exception instanceof EntityNotFoundError
    ) {
      statusCode = HttpStatus.NOT_FOUND;
      code = CommonErrorCodes.NotFoundError;
      message = i18n?.t(
        `${this.i18nCommonErrorsFile}.${CommonErrorCodes.NotFoundError}`,
      );
    } else if (exception instanceof HttpException) {
      statusCode = exception.getStatus();
      code = exception['response']['errorCode']
        ? exception['response']['errorCode']
        : CommonErrorCodes.InternalServerError;
      message = exception['response']['errorCode']
        ? i18n?.t(
            `${this.i18nCommonErrorsFile}.${exception['response']['errorCode']}`,
          )
        : exception['response']['message'];
    } else {
      statusCode = HttpStatus.INTERNAL_SERVER_ERROR;
      code = CommonErrorCodes.InternalServerError;
      message = i18n?.t(
        `${this.i18nCommonErrorsFile}.${CommonErrorCodes.InternalServerError}`,
      );

      if (exception instanceof Error) {
        this.logger.error(`${exception.message} ${exception.stack}`);
      }
    }

    response.status(statusCode).json({
      code: code,
      message: message,
      data: null,
      errors: null,
    });
  }
}
