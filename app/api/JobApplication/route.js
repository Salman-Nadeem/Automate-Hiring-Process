import { DbConnection } from "@/app/api/libs/Db";
import JobApplication from "@/app/api/model/JobApplication";

export async function POST(req) {
  try {
    await DbConnection();

    const formData = await req.formData();
    const name = formData.get("name");
    const email = formData.get("email");
    const phone = formData.get("phone");
    const cnic = formData.get("cnic");
    const currentAddress = formData.get("currentAddress");
    const education = formData.get("education");
    const lastSalary = formData.get("lastSalary");
    const expectedSalary = formData.get("expectedSalary");
    const joinDate = formData.get("joinDate");
    const whyHireYou = formData.get("whyHireYou");
    const position = formData.get("position");
    const experience = formData.get("experience");
    const references = formData.get("references");
    const skills = JSON.parse(formData.get("skills") || "[]");

    if (!name || !email || !phone || !position) {
      return new Response(
        JSON.stringify({ error: "Name, Email, Phone, and Position are required" }),
        { status: 400, headers: { "Content-Type": "application/json" } }
      );
    }

    const newApplication = new JobApplication({
      name,
      email,
      phone,
      cnic,
      currentAddress,
      education,
      lastSalary,
      expectedSalary,
      joinDate,
      whyHireYou,
      position,
      experience,
      references,
      skills,
    });

    await newApplication.save();

    // Optionally, set session data here if needed
    // req.session.jobApplicantPosition = position;
    // await req.session.save();

    return new Response(
      JSON.stringify({ success: true, message: "Application submitted successfully!", applicationId: newApplication._id }),
      { status: 201, headers: { "Content-Type": "application/json" } }
    );
  } catch (error) {
    console.error("Submission Error:", error);
    return new Response(JSON.stringify({ error: "Internal Server Error" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}



export async function GET() {
  try {
    await DbConnection();

    // MongoDB se sari applications fetch karo
    const applications = await JobApplication.find({});

    return new Response(
      JSON.stringify(applications),
      { status: 200, headers: { "Content-Type": "application/json" } }
    );
  } catch (error) {
    console.error("Fetch Error:", error);
    return new Response(
      JSON.stringify({ error: "Internal Server Error" }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
}