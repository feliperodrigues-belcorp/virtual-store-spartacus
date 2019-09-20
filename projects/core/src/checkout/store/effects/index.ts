import { AddressVerificationEffect } from './address-verification.effect';
import { CardTypesEffects } from './card-types.effect';
import { CheckoutEffects } from './checkout.effect';

export const effects: any[] = [
  CheckoutEffects,
  AddressVerificationEffect,
  CardTypesEffects,
];

export * from './address-verification.effect';
export * from './card-types.effect';
export * from './checkout.effect';
