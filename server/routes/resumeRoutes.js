import express from "express";
import { analyzeResume } from "./controllers/resumeController.js";
import upload from "../middleware/upload.js";

const router = express.Router();

router.post(
  "/analyze",
  upload.single("resume"),
  analyzeResume
);

export default router;