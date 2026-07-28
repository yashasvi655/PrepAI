import { useState } from "react";
import api from "../api/axios";
import { useNavigate } from "react-router-dom";

function UploadPDF() {

  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleUpload = async () => {

    if (!file) {
      alert("Select PDF first");
      return;
    }

    const formData = new FormData();
    formData.append("pdf", file);


    try {

      setLoading(true);

      const res = await api.post(
        "/pdf/upload",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data"
          }
        }
      );


      navigate("/quiz", {
        state: {
          questions: res.data.questions,
          topic: "PDF Notes",
        },
      });


    } catch (error) {
      console.log(error);
    }
    finally {
      setLoading(false);
    }

  };


 return (
  <div
    className="min-h-screen flex items-center justify-center p-8"
    style={{ backgroundColor: "var(--bg-primary)" }}
  >
    <div className="card w-full max-w-xl p-8 shadow-lg rounded-xl">

      <h1
        className="text-3xl font-bold mb-2"
        style={{ color: "var(--text-primary)" }}
      >
        📄 Generate Quiz from Notes
      </h1>

      <p
        className="mb-6 text-sm"
        style={{ color: "var(--text-secondary)" }}
      >
        Upload your PDF notes and let AI generate a personalized quiz based on
        your study material.
      </p>

      <input
        type="file"
        accept="application/pdf"
        onChange={(e) => setFile(e.target.files[0])}
        className="w-full border rounded-lg p-3 mb-4"
      />

      {file && (
        <div
          className="mb-5 p-3 rounded-lg"
          style={{ backgroundColor: "var(--bg-secondary)" }}
        >
          <p className="font-medium">Selected File</p>
          <p className="text-sm">{file.name}</p>
        </div>
      )}

      <button
        onClick={handleUpload}
        disabled={loading}
        className="btn-primary w-full rounded-lg p-3 font-medium disabled:opacity-50"
      >
        {loading
          ? "Generating AI Quiz..."
          : "Generate Quiz"}
      </button>

    </div>
  </div>
);
}

export default UploadPDF;