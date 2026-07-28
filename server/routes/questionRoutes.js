import express from "express";
import {
  generateQuiz,
  getQuestionsByTopic,
  submitQuiz,
  getAnalytics,
  getHistory,
  getAttemptDetail,
} from "./controllers/questionController.js";
import { protect } from "../middleware/authMiddleware.js";
import { aiLimiter } from "../middleware/rateLimiter.js";

const router = express.Router();

router.post("/generate", protect, aiLimiter, generateQuiz);
router.get("/analytics/me", protect, getAnalytics);
router.get("/history", protect, getHistory);
router.get("/history/:attemptId", protect, getAttemptDetail);
router.get("/:topic", protect, getQuestionsByTopic);
router.post("/submit", protect, submitQuiz);

export default router;