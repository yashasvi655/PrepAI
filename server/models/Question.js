import mongoose from "mongoose";

const questionSchema = new mongoose.Schema({
  topic: { type: String, required: true },
  examTarget: { type: String, required: true },
  questionText: { type: String, required: true },
  options: { type: [String], required: true },
  correctAnswer: { type: String, required: true },
  difficulty: { type: String, enum: ["easy", "medium", "hard"], default: "medium" },
  createdAt: { type: Date, default: Date.now }
});

const Question = mongoose.model("Question", questionSchema);
export default Question;