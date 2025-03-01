import { NextResponse } from "next/server";
import { DbConnection } from "@/app/api/libs/Db";
import Interview from "@/app/api/model/Interview";
import nodemailer from "nodemailer";
export async function POST(req) {
  try {
    console.log("📡 Connecting to MongoDB...");
    await DbConnection();
    console.log("✅ MongoDB Connected!");

    const data = await req.json();
    console.log("📩 Parsed Data:", data);

    const { candidateEmail, candidateName, position, interviewDate } = data;

    if (!candidateEmail || !candidateName || !position || !interviewDate) {
      console.log("❌ Missing Required Fields");
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    console.log("✅ Data received correctly!");

    // Save Interview in MongoDB
    const interview = await Interview.create({
      candidateEmail,
      candidateName,
      position,
      interviewDate,
    });

    console.log("✅ Interview Saved to Database:", interview);

    // Configure Nodemailer
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    console.log("📧 Sending Emails...");
    const emails = [
      {
        from: process.env.EMAIL_USER,
        to: candidateEmail,
        subject: "Your Interview is Scheduled",
        html: `<h2>Hello ${candidateName},</h2>
               <p>Your interview for <strong>${position}</strong> is scheduled on <strong>${interviewDate}</strong>.</p>
               <p>Join link: <a href="https://meet.example.com/interview-123">Click Here</a></p>
               <p>Good Luck!</p>`,
      },
      {
        from: process.env.EMAIL_USER,
        to: "owner@zmediatechnologies.com",
        subject: `New Interview Scheduled: ${candidateName}`,
        html: `<h2>New Interview Scheduled</h2>
               <p><strong>Candidate:</strong> ${candidateName}</p>
               <p><strong>Email:</strong> ${candidateEmail}</p>
               <p><strong>Position:</strong> ${position}</p>
               <p><strong>Interview Date:</strong> ${interviewDate}</p>`,
      },
    ];

    // Send Emails in Parallel
    await Promise.all(emails.map((mail) => transporter.sendMail(mail)));
    console.log("✅ Emails Sent Successfully!");

    return NextResponse.json({ message: "Interview scheduled successfully and emails sent!", interview }, { status: 201 });
  } catch (error) {
    console.error("❌ Server Error:", error);
    return NextResponse.json({ error: "Server Error", details: error.message }, { status: 500 });
  }
}





export async function GET(req) {
  try {
    await DbConnection();
    const interviews = await Interview.find({});
    return NextResponse.json({ interviews }, { status: 200 });
  } catch (error) {
    console.error("Error fetching interviews:", error);
    return NextResponse.json(
      { error: "Failed to fetch interviews", details: error.message },
      { status: 500 }
    );
  }
}






