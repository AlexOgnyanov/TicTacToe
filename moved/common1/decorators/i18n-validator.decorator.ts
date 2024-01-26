import ValidatorJS from 'validator';
import {
  Min,
  IsIn,
  IsInt,
  IsEnum,
  Matches,
  IsEmail,
  IsArray,
  IsNumber,
  IsString,
  IsDecimal,
  MinLength,
  MaxLength,
  IsBoolean,
  IsLatitude,
  IsNotEmpty,
  IsLongitude,
  IsDateString,
  IsMobilePhone,
  ArrayNotEmpty,
  IsNumberOptions,
  IsBooleanString,
  ValidationOptions,
  Max,
  ValidateNested,
} from 'class-validator';

export const _IsNotEmpty = (
  validationOptions?: ValidationOptions,
): PropertyDecorator =>
  IsNotEmpty({
    message: JSON.stringify({ errorCode: 'IS_NOT_EMPTY_ERROR' }),
    ...validationOptions,
  });

export const _IsInt = (
  validationOptions?: ValidationOptions,
): PropertyDecorator =>
  IsInt({
    message: JSON.stringify({ errorCode: 'IS_INT_ERROR' }),
    ...validationOptions,
  });

export const _IsString = (
  validationOptions?: ValidationOptions,
): PropertyDecorator =>
  IsString({
    message: JSON.stringify({ errorCode: 'IS_STRING_ERROR' }),
    ...validationOptions,
  });

export const _IsEmail = (
  options?: ValidatorJS.IsEmailOptions,
  validationOptions?: ValidationOptions,
): PropertyDecorator =>
  IsEmail(options, {
    message: JSON.stringify({ errorCode: 'IS_EMAIL_ERROR' }),
    ...validationOptions,
  });

export const _IsEnum = (
  entity: object,
  validationOptions?: ValidationOptions,
): PropertyDecorator =>
  IsEnum(entity, {
    message: JSON.stringify({ errorCode: 'IS_ENUM_ERROR' }),
    ...validationOptions,
  });

export const _IsDateString = (
  options?: ValidatorJS.IsISO8601Options,
  validationOptions?: ValidationOptions,
): PropertyDecorator =>
  IsDateString(options, {
    message: JSON.stringify({ errorCode: 'IS_DATE_STRING_ERROR' }),
    ...validationOptions,
  });

export const _IsMobilePhone = (
  locale?: ValidatorJS.MobilePhoneLocale,
  options?: ValidatorJS.IsMobilePhoneOptions,
  validationOptions?: ValidationOptions,
): PropertyDecorator =>
  IsMobilePhone(locale, options, {
    message: JSON.stringify({ errorCode: 'IS_MOBILE_PHONE_ERROR' }),
    ...validationOptions,
  });

export const _IsArray = (
  validationOptions?: ValidationOptions,
): PropertyDecorator =>
  IsArray({
    message: JSON.stringify({ errorCode: 'IS_ARRAY_ERROR' }),
    ...validationOptions,
  });

export const _MinLength = (
  min: number,
  validationOptions?: ValidationOptions,
): PropertyDecorator =>
  MinLength(min, {
    message: JSON.stringify({
      errorCode: 'MIN_LENGTH_ERROR',
      args: {
        constraint: min,
      },
    }),
    ...validationOptions,
  });

export const _MaxLength = (
  max: number,
  validationOptions?: ValidationOptions,
): PropertyDecorator =>
  MaxLength(max, {
    message: JSON.stringify({
      errorCode: 'MAX_LENGTH_ERROR',
      args: {
        constraint: max,
      },
    }),
    ...validationOptions,
  });

export const _Matches = (
  pattern: string,
  modifiers?: string,
  validationOptions?: ValidationOptions,
): PropertyDecorator =>
  Matches(pattern, modifiers, {
    message: JSON.stringify({ errorCode: 'MATCHES_ERROR' }),
    ...validationOptions,
  });

export const _IsLatitude = (
  validationOptions?: ValidationOptions,
): PropertyDecorator =>
  IsLatitude({
    message: JSON.stringify({ errorCode: 'IS_LATITUDE_ERROR' }),
    ...validationOptions,
  });

export const _IsLongitude = (
  validationOptions?: ValidationOptions,
): PropertyDecorator =>
  IsLongitude({
    message: JSON.stringify({ errorCode: 'IS_LONGITUDE_ERROR' }),
    ...validationOptions,
  });

export const _IsBooleanString = (
  validationOptions?: ValidationOptions,
): PropertyDecorator =>
  IsBooleanString({
    message: JSON.stringify({ errorCode: 'IS_BOOLEAN_STRING_ERROR' }),
    ...validationOptions,
  });

export const _IsBoolean = (
  validationOptions?: ValidationOptions,
): PropertyDecorator =>
  IsBoolean({
    message: JSON.stringify({ errorCode: 'IS_BOOLEAN_ERROR' }),
    ...validationOptions,
  });

export const _IsIn = (
  values: readonly any[],
  validationOptions?: ValidationOptions,
): PropertyDecorator =>
  IsIn(values, {
    message: JSON.stringify({
      errorCode: 'IS_IN_ERROR',
      args: { values: values },
    }),
    ...validationOptions,
  });

export const _IsDecimal = (
  options?: ValidatorJS.IsDecimalOptions,
  validationOptions?: ValidationOptions,
): PropertyDecorator =>
  IsDecimal(options, {
    message: JSON.stringify({ errorCode: 'IS_NUMBER_ERROR' }),
    ...validationOptions,
  });

export const _Min = (
  minValue: number,
  validationOptions?: ValidationOptions,
): PropertyDecorator =>
  Min(minValue, {
    message: JSON.stringify({
      errorCode: 'MIN_ERROR',
      args: {
        value: minValue,
      },
    }),
    ...validationOptions,
  });

export const _Max = (
  maxValue: number,
  validationOptions?: ValidationOptions,
): PropertyDecorator =>
  Max(maxValue, {
    message: JSON.stringify({
      errorCode: 'MAX_ERROR',
      args: {
        value: maxValue,
      },
    }),
    ...validationOptions,
  });

export const _ArrayNotEmpty = (
  validationOptions?: ValidationOptions,
): PropertyDecorator =>
  ArrayNotEmpty({
    message: JSON.stringify({ errorCode: 'IS_NOT_EMPTY_ERROR' }),
    ...validationOptions,
  });

export const _IsNumber = (
  options?: IsNumberOptions,
  validationOptions?: ValidationOptions,
): PropertyDecorator =>
  IsNumber(options, {
    message: JSON.stringify({ errorCode: 'IS_NUMBER_ERROR' }),
    ...validationOptions,
  });

export const _ValidateNested = (
  validationOptions?: ValidationOptions,
): PropertyDecorator =>
  ValidateNested({
    message: JSON.stringify({ errorCode: 'VALIDATE_NESTED_ERROR' }),
    ...validationOptions,
  });
