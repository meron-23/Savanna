import { phone } from 'phone';

export const normalizePhoneNumber = (rawNumber, countryCode = 'ETH') => {
  const { phoneNumber, isValid } = phone(rawNumber, { country: countryCode });
  return isValid ? phoneNumber : null;
};