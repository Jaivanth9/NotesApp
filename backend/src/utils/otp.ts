export const generateOtp = (): string => {
  // 6-digit OTP, zero-padded
  return Math.floor(100000 + Math.random() * 900000).toString();
};
