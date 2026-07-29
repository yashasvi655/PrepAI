import api from "../api/axios";

export const analyzeResume = async (file) => {
  const formData = new FormData();

  formData.append("resume", file);

  const response = await api.post(
    "/api/resume/analyze",
    formData,
    {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    }
  );

  return response.data;
};