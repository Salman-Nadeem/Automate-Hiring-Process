import { NextResponse } from "next/server";
import { DbConnection } from "@/app/api/libs/Db";
import User from "@/app/api/model/user";
import bcrypt from "bcryptjs";

export async function POST(req) {
  try {
    await DbConnection();
    const body = await req.json();
    console.log("Received Body:", body); // 🛠 Debugging

    const { email, newPassword } = body;
    if (!email || !newPassword) {
      return NextResponse.json({ error: "Missing email or password" }, { status: 400 });
    }

    const user = await User.findOne({ email });
    console.log("User Found:", user); // 🛠 Debugging

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 400 });
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);
    console.log("Hashed Password:", hashedPassword); // 🛠 Debugging

    user.password = hashedPassword;
    await user.save();

    return NextResponse.json({ message: "Password reset successful" }, { status: 200 });
  } catch (error) {
    console.error("Reset Password Error:", error);
    return NextResponse.json({ error: "Something went wrong", details: error.message }, { status: 500 });
  }
}
