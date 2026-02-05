import dotenv from "dotenv";
dotenv.config();

import Express from "express";
import cors from "cors";
import { clerkAuthMiddleware } from "./middleware/auth.middleware";
import userRouter from "./routes/user.routes";

const app = Express();

// CORS - allow frontend origin
app.use(
  cors({
    origin: process.env.FRONTEND_URL,
    credentials: true,
  }),
);
app.use(Express.json());
// app.use(clerkAuthMiddleware);

app.use("/api/user", userRouter);

export default app;
