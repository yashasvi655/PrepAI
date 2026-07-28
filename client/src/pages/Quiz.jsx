import { useState, useEffect, useRef } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import api from "../api/axios";

const TIME_PER_QUESTION = 30; // seconds

function Quiz() {
  const location = useLocation();
  const navigate = useNavigate();
  const { questions, topic } = location.state || {};

  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [timeLeft, setTimeLeft] = useState(TIME_PER_QUESTION);

  const timerRef = useRef(null);

  useEffect(() => {
    if (!questions || questions.length === 0) return;

    setTimeLeft(TIME_PER_QUESTION);

    timerRef.current = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timerRef.current);
          goToNextOrSubmit();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timerRef.current);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentIndex]);

  if (!questions || questions.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p style={{ color: "var(--text-secondary)" }}>
          No quiz loaded. Please start a quiz from the Dashboard.
        </p>
      </div>
    );
  }

  const currentQuestion = questions[currentIndex];
  const isLastQuestion = currentIndex === questions.length - 1;

  const handleSelect = (option) => {
    setSelectedAnswers({ ...selectedAnswers, [currentQuestion._id]: option });
  };

  const goToNextOrSubmit = () => {
    setCurrentIndex((prevIndex) => {
      if (prevIndex < questions.length - 1) {
        return prevIndex + 1;
      } else {
        handleSubmit();
        return prevIndex;
      }
    });
  };

  const handleNext = () => {
    clearInterval(timerRef.current);
    goToNextOrSubmit();
  };

  const handleSubmit = async () => {
    clearInterval(timerRef.current);
    setError("");
    setSubmitting(true);
    try {
      const answers = questions.map((q) => ({
        questionId: q._id,
        selectedAnswer: selectedAnswers[q._id] || "",
      }));

      const res = await api.post("/questions/submit", { topic, answers });
      navigate("/results", { state: { result: res.data, questions } });
    } catch (err) {
      setError(err.response?.data?.message || "Failed to submit quiz");
    } finally {
      setSubmitting(false);
    }
  };

  const timerColor = timeLeft <= 10 ? "var(--danger)" : "var(--accent)";

  return (
    <div className="min-h-screen p-8" style={{ backgroundColor: "var(--bg-primary)" }}>
      <div className="max-w-2xl mx-auto">
        <div className="flex justify-between items-center mb-4">
          <h1 className="text-xl font-semibold" style={{ color: "var(--text-secondary)" }}>
            {topic} Quiz
          </h1>
          <span className="text-sm" style={{ color: "var(--text-secondary)" }}>
            Question {currentIndex + 1} of {questions.length}
          </span>
        </div>

        <div className="card p-8 shadow-md">
          <div className="flex justify-between items-center mb-6">
            <p className="text-lg font-medium" style={{ color: "var(--text-primary)" }}>
              {currentQuestion.questionText}
            </p>
            <div
              className="ml-4 shrink-0 text-lg font-bold rounded-full w-12 h-12 flex items-center justify-center border-2"
              style={{ color: timerColor, borderColor: timerColor }}
            >
              {timeLeft}
            </div>
          </div>

          <div className="space-y-3 mb-6">
            {currentQuestion.options.map((option, idx) => (
              <button
                key={idx}
                onClick={() => handleSelect(option)}
                className="w-full text-left p-3 rounded-lg border transition"
                style={
                  selectedAnswers[currentQuestion._id] === option
                    ? { borderColor: "var(--accent)", backgroundColor: "rgba(37,99,235,0.1)", color: "var(--accent)" }
                    : { borderColor: "var(--border-color)", color: "var(--text-primary)" }
                }
              >
                {option}
              </button>
            ))}
          </div>

          {error && <p className="text-red-500 mb-4 text-sm">{error}</p>}

          {isLastQuestion ? (
            <button
              onClick={handleSubmit}
              disabled={submitting}
              className="w-full text-white rounded-lg p-3 font-medium disabled:opacity-50"
              style={{ backgroundColor: "var(--success)" }}
            >
              {submitting ? "Submitting..." : "Submit Quiz"}
            </button>
          ) : (
            <button
              onClick={handleNext}
              className="btn-primary w-full rounded-lg p-3 font-medium"
            >
              Next Question
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

export default Quiz;