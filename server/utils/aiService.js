import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const model = genAI.getGenerativeModel({ model: "gemini-flash-latest" });

export const generateQuestions = async (topic, examTarget, difficulty, count = 5) => {
  const prompt = `Generate ${count} multiple-choice questions for exam prep.
Topic: ${topic}
Exam target: ${examTarget}
Difficulty: ${difficulty}

Return ONLY valid JSON, no other text, in this exact format:
[
  {
    "questionText": "...",
    "options": ["A", "B", "C", "D"],
    "correctAnswer": "A",
    "difficulty": "${difficulty}"
  }
]`;

  const result = await model.generateContent(prompt);
  const text = result.response.text();
  const cleaned = text.replace(/```json|```/g, "").trim();
  return JSON.parse(cleaned);
};

export const explainAnswer = async (questionText, correctAnswer, userAnswer) => {
  const prompt = `Question: ${questionText}
Correct answer: ${correctAnswer}
Student's answer: ${userAnswer}

In 2-3 short sentences, explain why the correct answer is right and clear up the student's likely confusion. Keep it simple and encouraging.`;

  const result = await model.generateContent(prompt);
  return result.response.text();
};

export const generateQuestionsFromPDF = async (
  documentText,
  count = 5
) => {

  const prompt = `
You are an AI exam question generator.

A student uploaded study notes.

Generate exactly ${count} high-quality multiple-choice questions ONLY from the content below.

Rules:
- Do NOT use outside knowledge.
- Questions must come only from the uploaded document.
- Each question must have exactly 4 options.
- One correct answer.
- Keep options realistic.
- Return ONLY valid JSON.

Document:
${documentText}

Return JSON in this format:

[
  {
    "questionText":"...",
    "options":["A","B","C","D"],
    "correctAnswer":"A",
    "difficulty":"medium"
  }
]
`;

  const result = await model.generateContent(prompt);

  const text = result.response.text();

  const cleaned = text.replace(/```json|```/g, "").trim();

  return JSON.parse(cleaned);
};

export const analyzeResumeWithAI = async (resumeText) => {

  let attempts = 3;

  while (attempts > 0) {

    try {

      const limitedResume = resumeText.substring(0, 5000);

      const prompt = `
You are an expert ATS Resume Reviewer and Technical Interviewer.

Analyze the following resume and return ONLY valid JSON.

Resume:
${limitedResume}

Return JSON in exactly this format:

{
  "atsScore": 85,
  "summary": "...",
  "strengths": [
    "...",
    "..."
  ],
  "weaknesses": [
    "...",
    "..."
  ],
  "missingSkills": [
    "...",
    "..."
  ],
  "suggestions": [
    "...",
    "..."
  ],
  "interviewQuestions": [
    "...",
    "...",
    "...",
    "...",
    "..."
  ]
}

Do not return markdown.
Do not return explanation.
Return only valid JSON.
`;

      const result = await model.generateContent(prompt);

      const text = result.response.text();

      const cleaned = text.replace(/```json|```/g, "").trim();

      return JSON.parse(cleaned);


    } catch (error) {

      console.log(
        "Resume Analyzer Gemini Error:",
        error.message
      );

      attempts--;

      if (attempts === 0) {
        throw error;
      }


      console.log(
        "Retrying Gemini request..."
      );


      await new Promise(resolve =>
        setTimeout(resolve, 3000)
      );

    }
  }
};