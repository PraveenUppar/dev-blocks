import dotenv from "dotenv";
dotenv.config();
import Express from "express";
import cors from "cors";
import userRoute from "./routes/user.route.js";
import postRoute from "./routes/post.route.js";
import { authMiddleware } from "./middleware/auth.middleware.js";
import webhookRoutes from "./config/clerkwebhook.js";
const app = Express();
app.use(cors({
    origin: process.env.FRONTEND_URL,
    credentials: true,
}));
app.use("/api/webhooks", Express.json(), webhookRoutes);
app.use(Express.json());
app.use(authMiddleware);
app.use("/api/user", userRoute);
app.use("/api/post", postRoute);
export default app;
//# sourceMappingURL=app.js.map