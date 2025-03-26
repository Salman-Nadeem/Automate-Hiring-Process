import { NextResponse } from "next/server";

import { DbConnection } from "@/app/api/libs/Db";
import Job from "@/app/api/model/job";

export async function GET() {
  try {
    await DbConnection();
    const jobs = await Job.find({});
    return NextResponse.json(jobs, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch jobs" }, { status: 500 });
  }
}

export async function POST(req) {
  try {
    await DbConnection();
    const data = await req.json();

    const job = new Job(data); // ✅ Ensure "Job" (not "job") is used correctly
    await job.save();

    return NextResponse.json({ message: "Job posted successfully", job }, { status: 201 });
  } catch (error) {
    return NextResponse.json({ message: "Error posting job", error: error.message }, { status: 500 });
  }
}

export async function DELETE(req, { params }) {
  await dbConnect(); // MongoDB se connect

  try {
    const { id } = params;
    console.log("🛠️ Received ID in API:", id); // Debugging ke liye

    if (!id) {
      return NextResponse.json({ message: "❌ Job ID is missing" }, { status: 400 });
    }

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return NextResponse.json({ message: "❌ Invalid Job ID format" }, { status: 400 });
    }

    const deletedJob = await Job.findByIdAndDelete(id);

    if (!deletedJob) {
      console.log("❌ Job not found in database with ID:", id);
      return NextResponse.json({ message: "Job not found" }, { status: 404 });
    }

    console.log("✅ Job deleted successfully:", deletedJob);
    return NextResponse.json({ message: "Job deleted successfully" }, { status: 200 });
  } catch (error) {
    console.error("🔥 Error in DELETE API:", error);
    return NextResponse.json({ message: "Server error", error: error.message }, { status: 500 });
  }
}