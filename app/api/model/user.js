import mongoose from "mongoose";

const UserSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  otp: { type: String, default: null }, // ✅ OTP field add kiya
  otpExpiry: { type: Date, default: null }, // ✅ OTP expiry time add kiya
}, { timestamps: true });

const User = mongoose.models.User || mongoose.model("User", UserSchema);
export default User;
