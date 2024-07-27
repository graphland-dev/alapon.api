import { AppException, AppExceptionCode } from '../exceptions/app-exception';

export const processPhoneNumber = (phoneNumber: string) => {
  if (!phoneNumber) return '';
  const bangladeshPhonePattern = /^(?:\+880|880|0)1[3-9]\d{8}$/;

  if (!bangladeshPhonePattern.test(phoneNumber))
    throw new AppException(
      AppExceptionCode.FORBIDDEN,
      'Only Bangladeshi phone number is allowed!',
    );

  const _phoneNumber = phoneNumber.startsWith('+88')
    ? phoneNumber
    : `+88${phoneNumber}`;

  return _phoneNumber;
};
