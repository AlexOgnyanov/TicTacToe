import {
  Path,
  I18nContext,
  TranslateOptions,
  I18nValidationError,
} from 'nestjs-i18n';

export function formatI18nValidationErrors<K = Record<string, unknown>>(
  errors: I18nValidationError[],
  i18n: I18nContext<K>,
  options?: TranslateOptions,
) {
  return errors.map((error) => {
    const constraintParams = error.constraints
      ? JSON.parse(Object.values(error.constraints)[0])
      : null;
    const errorCode = constraintParams?.errorCode ?? '';
    const args = constraintParams?.args ?? '';
    const message = errorCode
      ? i18n.t(`validation-errors.${errorCode}` as Path<K>, {
          ...options,
          args: args,
        })
      : '';
    return {
      property: error.property,
      children: formatI18nValidationErrors(error.children ?? [], i18n),
      errorCode: errorCode,
      message: message,
    };
  });
}
