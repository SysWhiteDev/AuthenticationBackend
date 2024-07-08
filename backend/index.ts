const logger = require("pino")();
import express from "express";
const app = express();


app.listen(process.env.REST_PORT, () => {
    logger.info(`Authentication Server running on port ${process.env.REST_PORT}`)
})