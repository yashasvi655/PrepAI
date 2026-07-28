import Question from "../../models/Question.js";
import { generateQuestions, explainAnswer } from "../../utils/aiService.js";
import TestAttempt from "../../models/TestAttempt.js";


// Generate questions using AI and save them to DB
export const generateQuiz = async (req, res) => {
  try {
    const { topic, examTarget, count } = req.body;
    let { difficulty } = req.body;

    // Adaptive difficulty: check past performance on this topic
    const pastAttempts = await TestAttempt.find({ user: req.user._id, topic });

    if (pastAttempts.length > 0) {
      const totalCorrect = pastAttempts.reduce((sum, a) => sum + a.score, 0);
      const totalQuestions = pastAttempts.reduce((sum, a) => sum + a.totalQuestions, 0);
      const accuracy = totalCorrect / totalQuestions;

      if (accuracy >= 0.8) {
        difficulty = "hard";
      } else if (accuracy >= 0.5) {
        difficulty = "medium";
      } else {
        difficulty = "easy";
      }
    }
    // If no past attempts, use whatever difficulty was passed in (or default "medium")
    difficulty = difficulty || "medium";

    const aiQuestions = await generateQuestions(topic, examTarget, difficulty, count || 5);

    const savedQuestions = await Question.insertMany(
      aiQuestions.map((q) => ({ ...q, topic, examTarget }))
    );

    res.status(201).json({ questions: savedQuestions, difficultyUsed: difficulty });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Fetch existing questions by topic (no AI call, just DB read)
export const getQuestionsByTopic = async (req, res) => {
  try {
    const { topic } = req.params;
    const questions = await Question.find({ topic });
    res.json(questions);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


export const submitQuiz = async (req, res) => {
  try {
    const { topic, answers } = req.body;

    let score = 0;
    const gradedQuestions = [];

    for (const answer of answers) {
      const question = await Question.findById(answer.questionId);
      if (!question) continue;

      const isCorrect = question.correctAnswer === answer.selectedAnswer;
      if (isCorrect) score++;

      let explanation = null;
      if (!isCorrect) {
        explanation = await explainAnswer(
          question.questionText,
          question.correctAnswer,
          answer.selectedAnswer
        );
      }

      gradedQuestions.push({
        question: question._id,
        selectedAnswer: answer.selectedAnswer,
        isCorrect,
        explanation, // only filled in when wrong
      });
    }

    const attempt = await TestAttempt.create({
      user: req.user._id,
      topic,
      questions: gradedQuestions,
      score,
      totalQuestions: answers.length,
    });

    res.status(201).json({
      score,
      totalQuestions: answers.length,
      attemptId: attempt._id,
      details: gradedQuestions,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get all past attempts + topic-wise accuracy for the logged-in user
export const getAnalytics = async (req, res) => {
  try {
    const attempts = await TestAttempt.find({ user: req.user._id }).sort({ createdAt: -1 });

    // Group by topic to compute accuracy per topic
    const topicStats = {};
    attempts.forEach((attempt) => {
      if (!topicStats[attempt.topic]) {
        topicStats[attempt.topic] = { correct: 0, total: 0 };
      }
      topicStats[attempt.topic].correct += attempt.score;
      topicStats[attempt.topic].total += attempt.totalQuestions;
    });

    const topicAccuracy = Object.entries(topicStats).map(([topic, stats]) => ({
      topic,
      accuracy: Math.round((stats.correct / stats.total) * 100),
      totalAttempted: stats.total,
    }));

    // Recent attempts for a trend line (score over time)
    const recentAttempts = attempts.slice(0, 10).reverse().map((a) => ({
      date: a.createdAt,
      topic: a.topic,
      score: a.score,
      totalQuestions: a.totalQuestions,
      percentage: Math.round((a.score / a.totalQuestions) * 100),
    }));

    res.json({
      totalAttempts: attempts.length,
      topicAccuracy,
      recentAttempts,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }


};

// Get a simple list of all past attempts (for the history list page)
export const getHistory = async (req, res) => {
  try {
    const attempts = await TestAttempt.find({ user: req.user._id })
      .sort({ createdAt: -1 })
      .select("topic score totalQuestions createdAt"); // only send what's needed for a list view

    res.json(attempts);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get full detail of ONE specific attempt (questions, answers, explanations)
export const getAttemptDetail = async (req, res) => {
  try {
    const attempt = await TestAttempt.findOne({
      _id: req.params.attemptId,
      user: req.user._id, // security: only the owner can view their own attempt
    }).populate("questions.question"); // fetch full question details, not just the ID

    if (!attempt) {
      return res.status(404).json({ message: "Attempt not found" });
    }

    res.json(attempt);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};