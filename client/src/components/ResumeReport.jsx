function ResumeReport({ data }) {
  if (!data) return null;

  return (
    <div
      className="card p-6 rounded-xl mt-6"
      style={{ backgroundColor: "var(--bg-secondary)" }}
    >
      <h2
        className="text-xl font-bold mb-6"
        style={{ color: "var(--text-primary)" }}
      >
        Resume Analysis Report
      </h2>

      <div className="mb-5">
        <h3 className="font-semibold">ATS Score</h3>
        <p>{data.atsScore}/100</p>
      </div>

      <div className="mb-5">
        <h3 className="font-semibold">Summary</h3>
        <p>{data.summary}</p>
      </div>

      <div className="mb-5">
        <h3 className="font-semibold">Strengths</h3>
        <ul className="list-disc pl-5">
          {data.strengths?.map((item, index) => (
            <li key={index}>{item}</li>
          ))}
        </ul>
      </div>

      <div className="mb-5">
        <h3 className="font-semibold">Weaknesses</h3>
        <ul className="list-disc pl-5">
          {data.weaknesses?.map((item, index) => (
            <li key={index}>{item}</li>
          ))}
        </ul>
      </div>

      <div className="mb-5">
        <h3 className="font-semibold">Missing Skills</h3>
        <ul className="list-disc pl-5">
          {data.missingSkills?.map((item, index) => (
            <li key={index}>{item}</li>
          ))}
        </ul>
      </div>

      <div className="mb-5">
        <h3 className="font-semibold">Suggestions</h3>
        <ul className="list-disc pl-5">
          {data.suggestions?.map((item, index) => (
            <li key={index}>{item}</li>
          ))}
        </ul>
      </div>

      <div>
        <h3 className="font-semibold">Interview Questions</h3>
        <ol className="list-decimal pl-5">
          {data.interviewQuestions?.map((item, index) => (
            <li key={index}>{item}</li>
          ))}
        </ol>
      </div>
    </div>
  );
}

export default ResumeReport;