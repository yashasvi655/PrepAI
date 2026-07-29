import { PDFParse } from "pdf-parse";
import { analyzeResumeWithAI } from "../../utils/aiService.js";

export const analyzeResume = async (req, res) => {
  try {

    console.log("✅ Resume API hit");

    console.log("Uploaded File:", req.file?.originalname);


    if (!req.file) {
      return res.status(400).json({
        message: "No resume uploaded"
      });
    }


    console.log("📄 Reading PDF...");

    const dataBuffer = req.file.buffer;


    const parser = new PDFParse({
      data: dataBuffer
    });


    const pdfData = await parser.getText();


    console.log(
      "✅ PDF text extracted. Length:",
      pdfData.text.length
    );


    if (!pdfData.text || pdfData.text.length < 50) {
      return res.status(400).json({
        message: "Could not extract resume text"
      });
    }


    console.log("🤖 Sending resume to Gemini...");


    const analysis = await analyzeResumeWithAI(
      pdfData.text.substring(0, 5000)
    );


    console.log("✅ Gemini analysis completed");


    res.status(200).json(analysis);


  } catch (error) {

    console.error("❌ Resume Analyzer Error:");
    console.error(error);


    if (error.status === 503) {

      return res.status(503).json({
        message:
          "AI service is currently busy. Please try again in a few moments."
      });

    }


    res.status(500).json({
      message: error.message || "Server error"
    });
  }
};