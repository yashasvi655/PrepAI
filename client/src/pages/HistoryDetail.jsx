import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../api/axios";

function HistoryDetail() {
  const { attemptId } = useParams();
  const navigate = useNavigate();
  const [attempt, setAttempt] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchDetail = async () => {
      try {
        const res = await api.get(`/questions/history/${attemptId}`);
        setAttempt(res.data);
      } catch (err) {
        setError(err.response?.data?.message || "Failed to load attempt");
      }
    };
    fetchDetail();
  }, [attemptId]);

  if (error) return <div className="p-8 text-red-500">{error}</div>;
  if (!attempt)
    return (
      <div className="p-8" style={{ color: "var(--text-secondary)" }}>
        Loading...
      </div>
    );

  const percentage = Math.round((attempt.score / attempt.totalQuestions) * 100);

  return (
    <div className="min-h-screen p-8" style={{ backgroundColor: "var(--bg-primary)" }}>
      <div className="max-w-2xl mx-auto">
        <div className="card p-8 shadow-md mb-6 text-center">
          <h1 className="text-2xl font-bold mb-2" style={{ color: "var(--text-primary)" }}>
            {attempt.topic} — Review
          </h1>
          <p className="text-5xl font-bold mb-1" style={{ color: "var(--accent)" }}>
            {attempt.score}/{attempt.totalQuestions}
          </p>
          <p style={{ color: "var(--text-secondary)" }}>{percentage}% correct</p>
        </div>

        <div className="space-y-4">
          {attempt.questions.map((detail, idx) => (
            <div
              key={idx}
              className="card p-6 shadow-sm border-l-4"
              style={{
                borderLeftColor: detail.isCorrect ? "var(--success)" : "var(--danger)",
              }}
            >
              <p className="font-medium mb-2" style={{ color: "var(--text-primary)" }}>
                {detail.question?.questionText}
              </p>
              <p className="text-sm mb-1" style={{ color: "var(--text-secondary)" }}>
                Your answer:{" "}
                <span
                  style={{ color: detail.isCorrect ? "var(--success)" : "var(--danger)" }}
                >
                  {detail.selectedAnswer || "(no answer)"}
                </span>
              </p>
              {detail.explanation && (
                <p
                  className="text-sm mt-2 p-3 rounded-lg"
                  style={{ backgroundColor: "var(--bg-primary)", color: "var(--text-secondary)" }}
                >
                  💡 {detail.explanation}
                </p>
              )}
            </div>
          ))}
        </div>

        <button
          onClick={() => navigate("/history")}
          className="btn-primary w-full rounded-lg p-3 font-medium mt-6"
        >
          Back to History
        </button>
      </div>
    </div>
  );
}

export default HistoryDetail;