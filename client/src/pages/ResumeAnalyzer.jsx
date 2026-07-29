import ResumeUpload from "../components/ResumeUpload";

function ResumeAnalyzer() {
  return (
    <div
      className="min-h-screen p-8"
      style={{ backgroundColor: "var(--bg-primary)" }}
    >
      <div className="max-w-5xl mx-auto">

        <h1
          className="text-3xl font-bold mb-2"
          style={{ color: "var(--text-primary)" }}
        >
          AI Resume Analyzer
        </h1>

        <p
          className="mb-8"
          style={{ color: "var(--text-secondary)" }}
        >
          Upload your resume and receive AI-powered feedback, ATS score, and improvement suggestions.
        </p>

        <ResumeUpload />

      </div>
    </div>
  );
}

export default ResumeAnalyzer;