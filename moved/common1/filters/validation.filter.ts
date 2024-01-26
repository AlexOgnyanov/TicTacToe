import {
  Catch,
  HttpStatus,
  ArgumentsHost,
  ExceptionFilter,
} from '@nestjs/common';
import { Response } from 'express';
import { I18nContext } from 'nestjs-i18n';
import { CommonErrorCodes } from '@/common/errors';
import { ValidationException } from '@/common/exceptions';
import { formatI18nValidationErrors } from '@/common/utils';

@Catch(ValidationException)
export class ValidationExceptionFilter implements ExceptionFilter {
  private readonly i18nCommonErrorsFile = 'common-errors';

  async catch(exception: ValidationException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const i18n = I18nContext.current(host);
    const response = ctx.getResponse<Response>();

    const errors = formatI18nValidationErrors(exception.errors, i18n);

    response.status(HttpStatus.BAD_REQUEST).json({
      code: CommonErrorCodes.ValidationError,
      message: i18n.t(
        `${this.i18nCommonErrorsFile}.${CommonErrorCodes.ValidationError}`,
      ),
      data: null,
      errors: errors,
    });
  }
}
