import dotenv from "dotenv";
dotenv.config();
import Express from "express";
import cors from "cors";
import helmet from "helmet";
import { clerkMiddleware } from "@clerk/express";
import { errorHandler } from "./middleware/errorHandler.js";
import userRoute from "./routes/user.route.js";
import postRoute from "./routes/post.route.js";
import webhookRoutes from "./config/clerkwebhook.js";
const app = Express();
app.use(helmet());
app.use(cors({
    origin: process.env.FRONTEND_URL || "http://localhost:3000",
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
}));
app.use("/api/webhooks", Express.raw({ type: "application/json" }), webhookRoutes);
app.use(Express.json({ limit: "10mb" }));
app.use(clerkMiddleware());
app.get("/health", (req, res) => res.json({ status: "ok" }));
app.use("/api/user", userRoute);
app.use("/api/post", postRoute);
app.use((req, res) => {
    res.status(404).json({ error: "Route not found" });
});
app.use(errorHandler);
export default app;
//# sourceMappingURL=app.js.map