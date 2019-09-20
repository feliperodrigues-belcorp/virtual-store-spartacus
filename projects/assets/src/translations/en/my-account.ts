export const myAccount = {
  orderDetails: {
    orderId: 'Order #',
    placed: 'Placed',
    status: 'Status',
    shippedOn: 'Shipped on',
    inProcess: 'In process...',
    pending: 'Pending',
    deliveryStatus_READY_FOR_PICKUP: 'Ready for pickup',
    deliveryStatus_PICKUP_COMPLETE: 'Picked up',
    deliveryStatus_SHIPPED: 'Shipped',
    deliveryStatus_CANCELLED: 'Cancelled',
    statusDisplay_cancelled: 'Cancelled',
    statusDisplay_cancelling: 'Cancel Pending',
    statusDisplay_completed: 'Completed',
    statusDisplay_created: 'Created',
    statusDisplay_error: 'Pending',
    statusDisplay_Error: 'Pending',
    statusDisplay_open: 'Open',
    statusDisplay_processing: 'In Process',
  },
  orderHistory: {
    orderHistory: 'Order history',
    orderId: 'Order #',
    date: 'Date',
    status: 'Status',
    total: 'Total',
    noOrders: 'We have no order records for this account.',
    startShopping: 'Start Shopping',
    sortByMostRecent: 'Sort by Most recent',
  },
  closeAccount: {
    confirmAccountClosure: 'Confirm Account Closure',
    confirmAccountClosureMessage:
      'Are you sure you want to close your account?',
    closeMyAccount: 'CLOSE MY ACCOUNT',
    accountClosedSuccessfully: 'Account closed with success',
    accountClosedFailure: 'Failed to close account',
  },
  updateEmailForm: {
    newEmailAddress: {
      label: 'New email address',
      placeholder: 'Enter email',
    },
    confirmNewEmailAddress: {
      label: 'Confirm new email address',
      placeholder: 'Enter email',
    },
    enterValidEmail: 'Please enter a valid email.',
    bothEmailMustMatch: 'Both emails must match',
    password: {
      label: 'Password',
      placeholder: 'Enter password',
    },
    pleaseInputPassword: 'Please input password',
    emailUpdateSuccess: 'Success. Please sign in with {{ newUid }}',
  },
  updatePasswordForm: {
    oldPassword: {
      label: 'Old Password',
      placeholder: 'Old Password',
    },
    oldPasswordIsRequired: 'Old password is required.',
    newPassword: {
      label: 'New Password',
      placeholder: 'New Password',
    },
    passwordMinRequirements:
      'Password must be six characters minimum, with one uppercase letter, one number, one symbol',
    confirmPassword: {
      label: 'Confirm New Password',
      placeholder: 'Confirm Password',
    },
    bothPasswordMustMatch: 'Both password must match',
    passwordUpdateSuccess: 'Password updated with success',
  },
  updateProfileForm: {
    title: '',
    none: '',
    firstName: {
      label: 'First name',
      placeholder: 'First name',
    },
    firstNameIsRequired: 'First name is required.',
    lastName: {
      label: 'Last name',
      placeholder: 'Last name',
    },
    lastNameIsRequired: 'Last name is required.',
    profileUpdateSuccess: 'Personal details successfully updated',
  },
  consentManagementForm: {
    message: {
      success: {
        given: 'Consent successfully given.',
        withdrawn: 'Consent successfully withdrawn.',
      },
    },
  },
};
