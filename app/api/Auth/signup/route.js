import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { DbConnection } from "@/app/api/libs/Db";
import User from "@/app/api/model/user";

export async function POST(req) {
  try {
    await DbConnection();
    const { name, email, password, confirmPassword } = await req.json();

    // Validate input fields
    if (!name || !email || !password || !confirmPassword) {
      return NextResponse.json({ error: "All fields are required" }, { status: 400 });
    }

    if (password !== confirmPassword) {
      return NextResponse.json({ error: "Passwords do not match" }, { status: 400 });
    }

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return NextResponse.json({ error: "Email already in use" }, { status: 400 });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Save user
    const newUser = new User({
      name,
      email,
      password: hashedPassword,
      confirmPassword: hashedPassword, // Store hashed confirmPassword as well
    });

    await newUser.save();

    return NextResponse.json({ message: "User registered successfully" }, { status: 201 });
  } catch (error) {
    console.error("Signup Error:", error);
    return NextResponse.json({ error: "Something went wrong" }, { status: 500 });
  }
}
