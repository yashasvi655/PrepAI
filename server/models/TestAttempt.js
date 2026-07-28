import mongoose from "mongoose";

const testAttemptSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  topic: { type: String, required: true },
  difficulty: { type: String, default: "medium" },  
  questions: [
    {
      question: { type: mongoose.Schema.Types.ObjectId, ref: "Question" },
      questionText: String,                           
      selectedAnswer: String,
      correctAnswer: String,                           
      isCorrect: Boolean,
      explanation: String,
    },
  ],
  score: { type: Number, default: 0 },
  totalQuestions: { type: Number, required: true },
  timeTaken: { type: Number, default: 0 },            
  createdAt: { type: Date, default: Date.now },
});

const TestAttempt = mongoose.model("TestAttempt", testAttemptSchema);
export default TestAttempt;