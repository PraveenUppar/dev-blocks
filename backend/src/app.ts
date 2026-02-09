import dotenv from "dotenv";
dotenv.config();

import Express from "express";
import cors from "cors";
import { clerkMiddleware } from "@clerk/express";
import userRoute from "./routes/user.route.js";
import postRoute from "./routes/post.route.js";
import webhookRoutes from "./config/clerkwebhook.js";

const app = Express();
app.use(
  cors({
    origin: process.env.FRONTEND_URL || "http://localhost:3000",
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  }),
);
app.use("/api/webhooks", Express.json(), webhookRoutes);
app.use(Express.json());
app.use(clerkMiddleware());

app.use("/api/user", userRoute);
app.use("/api/post", postRoute);

export default app;
