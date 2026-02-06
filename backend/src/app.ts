import dotenv from "dotenv";
dotenv.config();

import Express from "express";
import cors from "cors";
// import { clerkAuthMiddleware   } from "./middleware/auth.middleware";
import userRouter from "./routes/user.routes";
import postRouter from "./routes/post.routes";
import tagRouter from "./routes/tag.routes";
import commentRouter from "./routes/comment.routes";
import notificationRouter from "./routes/notification.routes";
import webhookRoutes from "./routes/webhook.routes";

const app = Express();

// CORS - allow frontend origin
app.use(
  cors({
    origin: process.env.FRONTEND_URL,
    credentials: true,
  }),
);
app.use("/api/webhooks", Express.json(), webhookRoutes);
app.use(Express.json());
// app.use(clerkAuthMiddleware);

app.use("/api/user", userRouter);
app.use("/api/post", postRouter);
app.use("/api/tag", tagRouter);
app.use("/api/comment", commentRouter);
app.use("/api/notification", notificationRouter);

export default app;
