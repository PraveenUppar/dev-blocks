import Express from "express"
import cors from "cors"
import dotenv from "dotenv"

dotenv.config();

const app = Express();

app.use(cors());
app.use(Express.json());

export default app;