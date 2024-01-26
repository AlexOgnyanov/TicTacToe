export interface EmailVerificationTokenValidation {
  valid: boolean;
  userId: number;
  emailToChange?: string;
}
