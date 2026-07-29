import { useState } from "react";
import { analyzeResume } from "../services/resumeApi";
import ResumeReport from "./ResumeReport";

function ResumeUpload() {
    const [file, setFile] = useState(null);
    const [loading, setLoading] = useState(false);
    const [result, setResult] = useState(null);

    const handleAnalyze = async () => {
        try {
            setLoading(true);

            const response = await analyzeResume(file);

            console.log("Resume API Response:");
            console.log(JSON.stringify(response, null, 2));

            setResult(response);

        } catch (error) {
            console.error("Resume Error:", error);

            // Also print the backend response if there is one
            console.log(error.response?.data);

        } finally {
            setLoading(false);
        }
    };
    return (
        <div
            className="card p-6 rounded-xl"
            style={{ backgroundColor: "var(--bg-secondary)" }}
        >
            <h2
                className="text-xl font-semibold mb-4"
                style={{ color: "var(--text-primary)" }}
            >
                Upload Resume
            </h2>

            <input
                type="file"
                accept=".pdf"
                onChange={(e) => setFile(e.target.files[0])}
                className="w-full border rounded-lg p-3"
            />
            {file && (
                <div className="mt-4">
                    <p
                        className="text-sm"
                        style={{ color: "var(--text-secondary)" }}
                    >
                        Selected File: <strong>{file.name}</strong>
                    </p>
                </div>
            )}
            <button
                onClick={handleAnalyze}
                disabled={!file || loading}
                className="mt-6 w-full rounded-lg p-3 font-medium disabled:opacity-50"
                style={{
                    backgroundColor: "var(--accent-color, #2563eb)",
                    color: "#fff",
                }}
            >
                {loading ? "Analyzing Resume..." : "Analyze Resume"}
            </button>
            <ResumeReport data={result} />
        </div>
    );
}

export default ResumeUpload;