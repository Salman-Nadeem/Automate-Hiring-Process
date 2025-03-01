import { NextResponse } from "next/server";
import { DbConnection } from "@/app/api/libs/Db";
import User from "@/app/api/model/user";
import { sendOTP } from "@/app/api/utils/sendOtp";

export async function POST(req) {
  try {
    await DbConnection();
    const { email } = await req.json();
    const user = await User.findOne({ email });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 400 });
    }

    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    user.otp = otp;
    user.otpExpiry = new Date(Date.now() + 10 * 60 * 1000); // OTP valid for 10 mins
    await user.save();

    await sendOTP(email, otp); // Function to send OTP via email

    return NextResponse.json({ message: "OTP sent to your email" }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: "Failed to send OTP" }, { status: 500 });
  }
}
