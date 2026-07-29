import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/axios";
import { useAuth } from "../context/AuthContext";
import { useTheme } from "../context/ThemeContext";

function Dashboard() {
  const [topic, setTopic] = useState("");
  const [examTarget, setExamTarget] = useState("");
  const [difficulty, setDifficulty] = useState("medium");
  const [count, setCount] = useState(5);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [stats, setStats] = useState(null);

  const { user, logout } = useAuth();
  const { darkMode, toggleTheme } = useTheme();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await api.get("/questions/analytics/me");
        setStats(res.data);
      } catch (err) { }
    };

    fetchStats();
  }, []);

  const handleStartQuiz = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await api.post("/questions/generate", {
        topic,
        examTarget,
        difficulty,
        count,
      });

      navigate("/quiz", {
        state: {
          questions: res.data.questions,
          topic,
        },
      });

    } catch (err) {
      setError(err.response?.data?.message || "Failed to generate quiz");
    } finally {
      setLoading(false);
    }
  };


  return (
    <div
      className="min-h-screen p-6 md:p-10"
      style={{ backgroundColor: "var(--bg-primary)" }}
    >

      <div className="max-w-5xl mx-auto">


        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-10 gap-5">

          <div>
            <h1
              className="text-4xl font-bold tracking-tight"
              style={{ color: "var(--text-primary)" }}
            >
              Welcome, {user?.name} 👋
            </h1>

            <p
              className="mt-2 text-sm"
              style={{ color: "var(--text-secondary)" }}
            >
              Prepare smarter with AI generated quizzes
            </p>
          </div>


          <div className="flex flex-wrap gap-4 items-center">

            <button
              onClick={() => navigate("/analytics")}
              className="hover:underline text-sm font-medium"
              style={{ color: "var(--accent)" }}
            >
              Progress
            </button>

            <button
              onClick={() => navigate("/history")}
              className="hover:underline text-sm font-medium"
              style={{ color: "var(--accent)" }}
            >
              History
            </button>


            <button
              onClick={() => navigate("/leaderboard")}
              className="hover:underline text-sm font-medium"
              style={{ color: "var(--accent)" }}
            >
              Leaderboard
            </button>


            <button
              onClick={() => navigate("/upload-pdf")}
              className="hover:underline text-sm font-medium"
              style={{ color: "var(--accent)" }}
            >
              📄 Upload Notes
            </button>
            <button
              onClick={() => navigate("/resume-analyzer")}
              className="hover:underline text-sm font-medium"
              style={{ color: "var(--accent)" }}
            >
              📄 Resume Analyzer
            </button>


            <button
              onClick={toggleTheme}
              className="text-xl p-2 rounded-full hover:bg-gray-200/20 transition"
            >
              {darkMode ? "☀️" : "🌙"}
            </button>


            <button
              onClick={logout}
              className="text-sm font-medium hover:text-red-500"
              style={{ color: "var(--text-secondary)" }}
            >
              Logout
            </button>

          </div>

        </div>



        {/* Stats */}
        {stats && (

          <div className="grid md:grid-cols-3 gap-5 mb-10">


            <div className="card p-6 rounded-2xl shadow-md text-center">

              <p className="text-3xl font-bold"
                style={{ color: "var(--text-primary)" }}
              >
                {stats.totalAttempts}
              </p>

              <p className="mt-2 text-sm text-muted">
                Quizzes Taken
              </p>

            </div>


            <div className="card p-6 rounded-2xl shadow-md text-center">

              <p className="text-3xl font-bold"
                style={{ color: "var(--text-primary)" }}
              >
                {stats.topicAccuracy.length}
              </p>

              <p className="mt-2 text-sm text-muted">
                Topics Explored
              </p>

            </div>


            <div className="card p-6 rounded-2xl shadow-md text-center">

              <p className="text-3xl font-bold"
                style={{ color: "var(--text-primary)" }}
              >
                {
                  stats.topicAccuracy.length > 0
                    ?
                    Math.round(
                      stats.topicAccuracy.reduce(
                        (s, t) => s + t.accuracy, 0
                      ) /
                      stats.topicAccuracy.length
                    )
                    :
                    0
                }%

              </p>


              <p className="mt-2 text-sm text-muted">
                Average Accuracy
              </p>

            </div>


          </div>

        )}



        {/* Quiz Generator */}

        <div className="card rounded-3xl p-8 shadow-xl">


          <div className="mb-6">

            <h2
              className="text-2xl font-semibold"
              style={{ color: "var(--text-primary)" }}
            >
              Start a New Quiz 🚀
            </h2>


            <p
              className="text-sm mt-2"
              style={{ color: "var(--text-secondary)" }}
            >
              Generate personalized questions using AI
            </p>


          </div>



          {error && (

            <div className="bg-red-100 text-red-600 p-3 rounded-lg mb-5 text-sm">
              {error}
            </div>

          )}



          <form onSubmit={handleStartQuiz}
            className="space-y-5"
          >


            <input
              type="text"
              placeholder="Topic (e.g. Java, React, DSA)"
              value={topic}
              onChange={(e) => setTopic(e.target.value)}
              required
              className="input-field w-full rounded-xl p-4"
            />



            <input
              type="text"
              placeholder="Exam target (e.g. Cognizant, TCS)"
              value={examTarget}
              onChange={(e) => setExamTarget(e.target.value)}
              required
              className="input-field w-full rounded-xl p-4"
            />



            <div className="grid md:grid-cols-2 gap-5">


              <select
                value={difficulty}
                onChange={(e) => setDifficulty(e.target.value)}
                className="input-field rounded-xl p-4"
              >

                <option value="easy">Easy</option>
                <option value="medium">Medium</option>
                <option value="hard">Hard</option>

              </select>



              <select
                value={count}
                onChange={(e) => setCount(Number(e.target.value))}
                className="input-field rounded-xl p-4"
              >

                <option value={5}>5 Questions</option>
                <option value={10}>10 Questions</option>
                <option value={15}>15 Questions</option>
                <option value={20}>20 Questions</option>

              </select>


            </div>



            <button
              type="submit"
              disabled={loading}
              className="
              btn-primary 
              w-full 
              rounded-xl 
              p-4 
              font-semibold
              text-lg
              transition
              hover:scale-[1.02]
              disabled:opacity-50
              "
            >

              {
                loading
                  ?
                  "Generating questions with AI..."
                  :
                  "Start Quiz"
              }

            </button>


          </form>


        </div>


      </div>

    </div>
  );
}

export default Dashboard;