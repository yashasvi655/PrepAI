import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  LineChart, Line, Legend
} from "recharts";
import api from "../api/axios";

function Analytics() {
  const [data, setData] = useState(null);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        const res = await api.get("/questions/analytics/me");
        setData(res.data);
      } catch (err) {
        setError(err.response?.data?.message || "Failed to load analytics");
      }
    };
    fetchAnalytics();
  }, []);

  if (error) {
    return <div className="p-8 text-red-500">{error}</div>;
  }

  if (!data) {
    return <div className="p-8 text-gray-500">Loading analytics...</div>;
  }

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="max-w-3xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold text-gray-800">Your Progress</h1>
          <button
            onClick={() => navigate("/dashboard")}
            className="text-sm text-blue-600 hover:underline"
          >
            Back to Dashboard
          </button>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-md mb-6">
          <p className="text-gray-500 text-sm mb-1">Total quizzes taken</p>
          <p className="text-3xl font-bold text-gray-800">{data.totalAttempts}</p>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-md mb-6">
          <h2 className="text-lg font-semibold text-gray-800 mb-4">
            Accuracy by Topic
          </h2>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={data.topicAccuracy}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="topic" />
              <YAxis domain={[0, 100]} unit="%" />
              <Tooltip />
              <Bar dataKey="accuracy" fill="#2563eb" radius={[6, 6, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-md">
          <h2 className="text-lg font-semibold text-gray-800 mb-4">
            Recent Score Trend
          </h2>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={data.recentAttempts}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="topic" />
              <YAxis domain={[0, 100]} unit="%" />
              <Tooltip />
              <Legend />
              <Line
                type="monotone"
                dataKey="percentage"
                stroke="#16a34a"
                strokeWidth={2}
                name="Score %"
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}

export default Analytics;