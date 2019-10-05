import { UserSignUp } from '@spartacus/core';

export interface BelcorpUserSignUp extends UserSignUp {
  terms?: boolean;
  phone?: string;
}
