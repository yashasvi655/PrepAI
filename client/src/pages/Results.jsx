import { useLocation, useNavigate } from "react-router-dom";

function Results() {
  const location = useLocation();
  const navigate = useNavigate();
  const { result, questions } = location.state || {};

  if (!result) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-gray-600">No results found.</p>
      </div>
    );
  }

  const getQuestionText = (questionId) => {
    const q = questions.find((q) => q._id === questionId);
    return q ? q.questionText : "";
  };

  const percentage = Math.round((result.score / result.totalQuestions) * 100);

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="max-w-2xl mx-auto">
        <div className="bg-white p-8 rounded-xl shadow-md mb-6 text-center">
          <h1 className="text-2xl font-bold text-gray-800 mb-2">Quiz Results</h1>
          <p className="text-5xl font-bold text-blue-600 mb-1">
            {result.score}/{result.totalQuestions}
          </p>
          <p className="text-gray-500">{percentage}% correct</p>
        </div>

        <div className="space-y-4">
          {result.details.map((detail, idx) => (
            <div
              key={idx}
              className={`bg-white p-6 rounded-xl shadow-sm border-l-4 ${
                detail.isCorrect ? "border-green-500" : "border-red-500"
              }`}
            >
              <p className="font-medium text-gray-800 mb-2">
                {getQuestionText(detail.question)}
              </p>
              <p className="text-sm text-gray-600 mb-1">
                Your answer:{" "}
                <span
                  className={detail.isCorrect ? "text-green-600" : "text-red-600"}
                >
                  {detail.selectedAnswer || "(no answer)"}
                </span>
              </p>
              {detail.explanation && (
                <p className="text-sm text-gray-500 mt-2 bg-gray-50 p-3 rounded-lg">
                  💡 {detail.explanation}
                </p>
              )}
            </div>
          ))}
        </div>

        <button
          onClick={() => navigate("/dashboard")}
          className="w-full bg-blue-600 text-white rounded-lg p-3 font-medium hover:bg-blue-700 mt-6"
        >
          Back to Dashboard
        </button>
      </div>
    </div>
  );
}

export default Results;