import mongoose from 'mongoose';

const otpSchema = new mongoose.Schema(
    {
        email: {
            type: String,
            required: true,
        },
        otp: {
            type: String,
            required: true,
        },
        expiryTime: {
            type: Date,
            required: true,
            expires: 600,
          },
    },
    { timestamps: true }
);

const OTP = mongoose.model('OTP', otpSchema);

export default OTP;
