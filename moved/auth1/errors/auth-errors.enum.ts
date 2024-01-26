export enum AuthErrorCodes {
  EmailNotVerifiedError = 'EMAIL_NOT_VERIFIED_ERROR',
  InvalidCredentialsError = 'INVALID_CREDENTIALS_ERROR',
  InvalidAccessTokenError = 'INVALID_ACCESS_TOKEN_ERROR',
  InvalidRefreshTokenError = 'INVALID_REFRESH_TOKEN_ERROR',
  EmailAlreadyVerifiedError = 'EMAIL_ALREADY_VERIFIED_ERROR',
  OldPasswordNotMatchingError = 'OLD_PASSWORD_NOT_MATCHING_ERROR',
  ThisIsYourCurrentEmailError = 'THIS_IS_YOUR_CURRENT_EMAIL_ERROR',
  EmailVerificationDisabledError = 'EMAIL_VERIFICATION_DISABLED_ERROR',
  InvalidPasswordResetTokenError = 'INVALID_PASSWORD_RESET_TOKEN_ERROR',
  InvalidEmailVerificationTokenError = 'INVALID_EMAIL_VERIFICATION_TOKEN_ERROR',
  RecentlyRequestedPasswordResetTokenError = 'RECENTLY_REQUESTED_PASSWORD_RESET_TOKEN_ERROR',
  RecentlyRequestedEmailVerificationTokenError = 'RECENTLY_REQUESTED_EMAIL_VERIFICATION_TOKEN_ERROR',
}
