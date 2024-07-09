import pino from "pino";
const logger = pino();
import express from "express";
import jwt from "jsonwebtoken";
const app = express();
app.use(express.json());

import cors from "cors";
app.use(cors());


import auth from "./routes/auth";
import prisma from "./utils/db";
import verifyAuth from "./middlewares/verifyAuth";
app.use("/auth", auth);

app.get("/user", verifyAuth, async (req, res) => {
    const token = req.headers.authorization?.split(" ")[1] || req.headers.authorization;
    const decode: any = jwt.decode(token as string);
    if (!decode) {
        res.status(500).json({
            status: "error",
            message: "internal_server_error"
        })
        return;
    }
    await prisma.user.findUnique({
        where: {
            id: decode.id
        }
    }).then((data) => {
        res.status(200).json({
            status: "success",
            user: {
                id: data?.id,
                name: data?.name
            }
        })
    }).catch(() => {
        res.status(500).json({
            status: "error",
            message: "internal_server_error"
        })
        return;
    })
})

app.listen(process.env.REST_PORT, () => {
    logger.info(`Authentication Server running on port ${process.env.REST_PORT}`)
})