import express from "express";
import {
  saveAttempt,
  getAllAttempts,
  getAttemptById,
  getLeaderboard
} from "./controllers/attemptController.js";

const router = express.Router();

router.post("/", saveAttempt);
router.get("/", getAllAttempts);

router.get("/leaderboard", getLeaderboard);
router.get("/:attemptId", getAttemptById);
export default router;