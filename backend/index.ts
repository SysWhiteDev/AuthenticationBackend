const logger = require("pino")();
import express from "express";
const app = express();
app.use(express.json());

var cors = require('cors')
app.use(cors());


import auth from "./routes/auth";
app.use("/auth", auth);

app.listen(process.env.REST_PORT, () => {
    logger.info(`Authentication Server running on port ${process.env.REST_PORT}`)
})