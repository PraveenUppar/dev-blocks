import dotenv from "dotenv";
dotenv.config();

import Express from "express";
import cors from "cors";
import helmet from "helmet";
import { clerkMiddleware } from "@clerk/express";
import { errorHandler } from "./middleware/errorHandler.js";
import { requestLogger } from "./middleware/requestLogger.js";
import { AppError } from "./errors/AppError.js";
import userRoute from "./routes/user.route.js";
import postRoute from "./routes/post.route.js";
import healthRouter from "./routes/health.route.js";
import webhookRoutes from "./config/clerkwebhook.js";

const app = Express();
app.use(helmet());
app.use(requestLogger);
app.use(
  cors({
    origin: process.env.FRONTEND_URL,
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  }),
);
app.use(
  "/api/webhooks",
  Express.raw({ type: "application/json" }),
  webhookRoutes,
);
app.use(Express.json({ limit: "10mb" }));
app.use(clerkMiddleware());

app.use("/health", healthRouter);
app.use("/api/user", userRoute);
app.use("/api/post", postRoute);

app.use((req, res, next) => {
  next(AppError.notFound("Route not found"));
});

app.use(errorHandler);

export default app;
