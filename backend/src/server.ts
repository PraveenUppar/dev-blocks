import app from "./app.js";
import logger from "./config/logger.js";

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  logger.info(`Dev-Blocks Backend Server Running on port ${PORT}`);
});
