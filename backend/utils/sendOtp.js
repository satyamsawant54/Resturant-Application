import nodemailer from "nodemailer";

const sendOtpToUser = async (email, otpData) => {
   const transporter = nodemailer.createTransport({
    service: 'Gmail',
    auth: {
      user: 'alexndegwa49@gmail.com', 
      pass: 'huumwjugrxugghzq', 
    },
  });

  const mailOptions = {
    from: 'alexndegwa49@gmail.com', 
    to: email,
    subject: 'OTP for email confirmation',
    text: `Your OTP is: ${otpData.otp} Expires in 10 Minutes`,
  };

  await transporter.sendMail(mailOptions);
};


export { sendOtpToUser };
