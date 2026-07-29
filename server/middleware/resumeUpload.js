import multer from "multer";

const storage = multer.memoryStorage();

const resumeUpload = multer({
  storage,

  fileFilter: (req, file, cb) => {
    if (file.mimetype === "application/pdf") {
      cb(null, true);
    } else {
      cb(new Error("Only PDF files are allowed"));
    }
  },

  limits: {
    fileSize: 5 * 1024 * 1024, // 5 MB
  },
});

export default resumeUpload;