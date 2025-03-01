import mongoose from "mongoose";

const QuestionSchema = new mongoose.Schema({
  field: { type: String, required: true },
  question: { type: String, required: true },
  options: { type: [String], required: true },
  correctAnswer: { type: String, required: true },
});
const Question =  mongoose.models.Question || mongoose.model("Question", QuestionSchema);
export default Question