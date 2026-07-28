import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/axios";

function History() {
  const [attempts, setAttempts] = useState([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const res = await api.get("/questions/history");
        setAttempts(res.data);
      } catch (err) {
        setError(err.response?.data?.message || "Failed to load history");
      } finally {
        setLoading(false);
      }
    };
    fetchHistory();
  }, []);

  return (
    <div className="min-h-screen p-8" style={{ backgroundColor: "var(--bg-primary)" }}>
      <div className="max-w-2xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold" style={{ color: "var(--text-primary)" }}>
            Quiz History
          </h1>
          <button
            onClick={() => navigate("/dashboard")}
            className="text-sm hover:underline"
            style={{ color: "var(--accent)" }}
          >
            Back to Dashboard
          </button>
        </div>

        {loading && <p style={{ color: "var(--text-secondary)" }}>Loading...</p>}
        {error && <p className="text-red-500">{error}</p>}

        {!loading && attempts.length === 0 && (
          <p style={{ color: "var(--text-secondary)" }}>
            No quizzes taken yet. Go start one!
          </p>
        )}

        <div className="space-y-3">
          {attempts.map((attempt) => {
            const percentage = Math.round(
              (attempt.score / attempt.totalQuestions) * 100
            );
            return (
              <button
                key={attempt._id}
                onClick={() => navigate(`/history/${attempt._id}`)}
                className="card w-full text-left p-5 shadow-sm flex justify-between items-center hover:opacity-80 transition"
              >
                <div>
                  <p className="font-medium" style={{ color: "var(--text-primary)" }}>
                    {attempt.topic}
                  </p>
                  <p className="text-xs" style={{ color: "var(--text-secondary)" }}>
                    {new Date(attempt.createdAt).toLocaleDateString()}
                  </p>
                </div>
                <div className="text-right">
                  <p
                    className="font-bold text-lg"
                    style={{
                      color: percentage >= 50 ? "var(--success)" : "var(--danger)",
                    }}
                  >
                    {attempt.score}/{attempt.totalQuestions}
                  </p>
                  <p className="text-xs" style={{ color: "var(--text-secondary)" }}>
                    {percentage}%
                  </p>
                </div>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}

export default History;