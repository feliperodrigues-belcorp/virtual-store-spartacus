import { Address, UserSignUp } from '@spartacus/core';

export interface BelcorpUserSignUp extends UserSignUp {
  terms?: boolean;
  phone?: string;
}
export interface BelcorpAddress extends Address {
  reference?: string;
  commune?: string;
  locality?: string;
  department?: string;
  province?: string;
  district?: string;
}
