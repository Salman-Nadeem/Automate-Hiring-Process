import mongoose from "mongoose";

const JobApplicationSchema = new mongoose.Schema({
  name: String,
  email: String,
  phone: String,
  cnic: String,
  currentAddress: String,
  education: String,
  lastSalary: String,
  expectedSalary: String,
  joinDate: String,
  whyHireYou: String,
  position: String,
  experience: String,
  references: String,
  skills: [String],
  cvUrl: String, // CV ka Cloudinary URL
});

const job_application =  mongoose.models.JobApplication || mongoose.model("JobApplication", JobApplicationSchema);
export default job_application
