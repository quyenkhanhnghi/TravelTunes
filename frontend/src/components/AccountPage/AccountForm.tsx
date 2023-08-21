import React from 'react';

export type AccountFormType = {
  name: string;
  email: string;
};

export type PasswordFormType = {
  currentPassword: string;
  newPassword: string;
  confirmNewPassword: string;
};

export const defaultAccountForm: AccountFormType = { name: '', email: '' };
export const defaultPasswordForm: PasswordFormType = {
  currentPassword: '',
  newPassword: '',
  confirmNewPassword: '',
};
