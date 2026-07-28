import { PDFParse } from "pdf-parse";
import fs from "fs";
import Question from "../../models/Question.js";
import { generateQuestionsFromPDF } from "../../utils/aiService.js";

export const generateQuizFromPDF = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        message: "Please upload a PDF.",
      });
    }

    // Read uploaded PDF
    const dataBuffer = fs.readFileSync(req.file.path);

    // Extract text from PDF
    const parser = new PDFParse({
      data: dataBuffer,
    });

    const pdfData = await parser.getText();

    // Clean extracted text
    const extractedText = pdfData.text
      .replace(/\s+/g, " ")
      .trim()
      .slice(0, 12000);

    if (!extractedText) {
      fs.unlinkSync(req.file.path);

      return res.status(400).json({
        message: "No readable text found in the uploaded PDF.",
      });
    }

    console.log("PDF Text Extracted Successfully");

    // Generate AI questions
    const aiQuestions = await generateQuestionsFromPDF(
      extractedText,
      5
    );

    console.log("AI Questions Generated");

    // Save generated questions
    const savedQuestions = await Question.insertMany(
      aiQuestions.map((question) => ({
        ...question,
        topic: "PDF Notes",
        examTarget: "Uploaded PDF",
      }))
    );

    // Remove uploaded file
    fs.unlinkSync(req.file.path);

    res.status(201).json({
      success: true,
      message: "Quiz generated successfully.",
      questions: savedQuestions,
    });

  } catch (error) {

    if (req.file && fs.existsSync(req.file.path)) {
      fs.unlinkSync(req.file.path);
    }

    console.error("PDF Quiz Generation Error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to generate quiz from PDF.",
      error: error.message,
    });
  }
};