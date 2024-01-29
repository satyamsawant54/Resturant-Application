import { addMinutes } from "date-fns";

const OTP_EXPIRY_MINUTES = 10; 

const generateOTP = () => {
  const otpLength = 5;
  const otp = Math.floor(Math.random() * Math.pow(10, otpLength)).toString();

  const expiryTime = addMinutes(new Date(), OTP_EXPIRY_MINUTES);

  return {
    otp: otp.padStart(otpLength, "0"),
    expiryTime,
  };
};

const verifyOTP = (otp, enteredOTP) => {
  return otp === enteredOTP;
};

export { generateOTP, verifyOTP };
