import mongoose from "mongoose";

const JobSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    company: { type: String, required: true },
    location: { type: String, required: true },
    salary: { type: String, required: true },
    type: { type: String, required: true },
    description: { type: String, required: true },
    requirements: { type: String, required: true },
    responsibilities: { type: String, required: true },
    experience: { type: String, required: true },
    education: { type: String, required: true },
    applicationDeadline: { type: Date, required: true },
    contactEmail: { type: String, required: true },
    benefits: { type: String },
    remoteWork: { type: Boolean, default: false },
  },
  { timestamps: true }
);

export default mongoose.models.Job || mongoose.model("Job", JobSchema);
