import dotenv from "dotenv";
dotenv.config();

import Express from "express";
import cors from "cors";

const app = Express();

app.use(cors());
app.use(Express.json());

export default app;
