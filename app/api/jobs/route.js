import { NextResponse } from "next/server";

import { DbConnection } from "@/app/api/libs/Db";
import job from "@/app/api/model/job";

export async function GET() {
  try {
    await DbConnection();
    const jobs = await job.find({});
    return NextResponse.json(jobs, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch jobs" }, { status: 500 });
  }
}

export async function POST(req) {
  try {
    await DbConnection(); // Database se connect karo
    const jobData = await req.json(); // Request body lo

    // Single ya multiple jobs insert karo
    const insertedJob = await job.create(jobData);

    return NextResponse.json({ success: true, data: insertedJob }, { status: 201 });
  } catch (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
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