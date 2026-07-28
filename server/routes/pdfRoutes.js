import express from "express";
import upload from "../middleware/upload.js";
import { generateQuizFromPDF } from "./controllers/pdfController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

router.post(
  "/upload",
  protect,
  upload.single("pdf"),
  generateQuizFromPDF
);

export default router;