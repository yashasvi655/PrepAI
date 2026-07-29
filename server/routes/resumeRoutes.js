import express from "express";
import { analyzeResume } from "./controllers/resumeController.js";
import resumeUpload from "../middleware/resumeUpload.js";

const router = express.Router();

router.post(
  "/analyze",
  resumeUpload.single("resume"),
  analyzeResume
);

export default router;