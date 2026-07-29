import fs from "fs";
import { PDFParse } from "pdf-parse";

export const analyzeResume = async (req, res) => {
  try {

    console.log("Resume API hit");

    if (!req.file) {
      return res.status(400).json({
        message: "No resume uploaded"
      });
    }

    const dataBuffer = fs.readFileSync(req.file.path);

    const parser = new PDFParse({
      data: dataBuffer
    });

    const pdfData = await parser.getText();

    res.json({
      message: "Resume text extracted successfully",
      text: pdfData.text
    });

  } catch (error) {
    console.log(error);

    res.status(500).json({
      message: "Server error"
    });
  }
};