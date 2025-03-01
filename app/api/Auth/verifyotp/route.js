import { NextResponse } from "next/server";
import { DbConnection } from "@/app/api/libs/Db";
import User from "@/app/api/model/user";

export async function POST(req) {
  try {
    await DbConnection();
    const { email, otp } = await req.json();

    const user = await User.findOne({ email });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    console.log(`Stored OTP: ${user.otp}, Received OTP: ${otp}, Expiry: ${user.otpExpiry}`); // 

    if (!user.otp || user.otp !== otp || new Date(user.otpExpiry) < new Date()) {
      return NextResponse.json({ error: "Invalid or expired OTP" }, { status: 400 });
    }

    // OTP verified, remove it
    user.otp = null;
    user.otpExpiry = null;
    await user.save();

    return NextResponse.json({ message: "OTP verified successfully" }, { status: 200 });
  } catch (error) {
    console.error("Error in OTP verification:", error);
    return NextResponse.json({ error: "Something went wrong" }, { status: 500 });
  }
}
