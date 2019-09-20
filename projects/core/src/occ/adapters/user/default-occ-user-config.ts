import { OccConfig } from '../../config/occ-config';

export const defaultOccUserConfig: OccConfig = {
  backend: {
    occ: {
      endpoints: {
        user: 'users/${userId}',
        userRegister: 'users',
        userForgotPassword: 'forgottenpasswordtokens',
        userResetPassword: 'resetpassword',
        userUpdateLoginId: 'users/${userId}/login',
        userUpdatePassword: 'users/${userId}/password',
        titles: 'titles',
        paymentDetailsAll: 'users/${userId}/paymentdetails',
        paymentDetail: 'users/${userId}/paymentdetails/${paymentDetailId}',
        orderHistory: 'users/${userId}/orders',
        orderDetail: 'users/${userId}/orders/${orderId}?fields=FULL',
        consentTemplates: 'users/${userId}/consenttemplates',
        consents: 'users/${userId}/consents',
        consentDetail: 'users/${userId}/consents/${consentId}',
        addresses: 'users/${userId}/addresses',
        addressDetail: 'users/${userId}/addresses/${addressId}',
        addressVerification: 'users/${userId}/addresses/verification',
      },
    },
  },
};
