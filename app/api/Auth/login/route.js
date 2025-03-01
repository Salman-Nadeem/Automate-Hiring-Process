import { NextResponse } from "next/server";
import { DbConnection } from "@/app/api/libs/Db";
import User from "@/app/api/model/user";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

export async function POST(req) {
  try {
    await DbConnection();

    const { email, password } = await req.json();
    const user = await User.findOne({ email });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 400 });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return NextResponse.json({ error: "Invalid credentials" }, { status: 400 });
    }

    // ✅ JWT token generate with email & id
    const token = jwt.sign(
      { id: user._id, email: user.email },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );

    // ✅ JWT verify to get decoded user data
    const decodedUser = jwt.verify(token, process.env.JWT_SECRET);

    return NextResponse.json({ token, user: decodedUser }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: "Something went wrong" }, { status: 500 });
  }
}
