import "dotenv/config";          
import express from "express";
import connectDB from "./config/db.js";
import authRoutes from "./routes/authRoutes.js";
import questionRoutes from "./routes/questionRoutes.js";
import cors from "cors";
import { generalLimiter } from "./middleware/rateLimiter.js";
import attemptRoutes from "./routes/attemptRoutes.js";
import pdfRoutes from "./routes/pdfRoutes.js";

import dns from 'dns';
dns.setServers(['8.8.8.8', '8.8.4.4']);

connectDB();

const app = express();
app.use(cors());
app.use(express.json());
app.use(generalLimiter);



app.use("/api/auth", authRoutes);
app.use("/api/questions", questionRoutes);
app.use("/api/attempts", attemptRoutes);
app.use("/api/pdf", pdfRoutes);

app.get("/", (req, res) => {
    res.json({ success: true, message: "PrepAI Backend Running 🚀" });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});