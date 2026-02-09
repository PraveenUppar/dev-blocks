import rateLimit from "express-rate-limit";

// General API rate limit
export const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // 100 requests per window
  message: "Too many requests, please try again later",
  standardHeaders: true,
  legacyHeaders: false,
});

// Stricter for write operations
export const createLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 10, // 10 posts per hour
  message: "Too many posts created, please try again later",
});

// Very strict for like/bookmark
export const interactionLimiter = rateLimit({
  windowMs: 1 * 60 * 1000, // 1 minute
  max: 30, // 30 actions per minute
  skipSuccessfulRequests: true,
});
