import mongoose from "mongoose";

const InterviewSchema = new mongoose.Schema({
  candidateEmail: {
    type: String,
    required: true,
  },
  candidateName: {
    type: String,
    required: true,
  },
  position: {
    type: String,
    required: true,
  },
  interviewDate: {
    type: String,
    required: true,
  },
});

const Interview = mongoose.models.Interview || mongoose.model("Interview", InterviewSchema);

export default Interview;
