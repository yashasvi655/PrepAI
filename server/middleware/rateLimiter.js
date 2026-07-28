import rateLimit from "express-rate-limit";

// Limit AI-heavy endpoints specifically (generation is expensive)
export const aiLimiter = rateLimit({
  windowMs: 60 * 1000, // 1 minute
  max: 5, // max 5 AI requests per minute per IP
  message: { message: "Too many AI requests. Please wait a minute and try again." },
  standardHeaders: true,
  legacyHeaders: false,
});

// General limiter for all API routes (broader protection)
export const generalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100,
  message: { message: "Too many requests. Please try again later." },
});