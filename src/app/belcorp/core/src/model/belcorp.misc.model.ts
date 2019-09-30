import { UserSignUp } from '@spartacus/core';

export interface BelcorpUserSignUp extends UserSignUp {
  termsandconditions?: boolean;
}
