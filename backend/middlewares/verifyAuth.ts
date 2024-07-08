import type { NextFunction, Request, Response } from "express";
import prisma from "../utils/db";
import jwt from "jsonwebtoken";
export default function (req: Request, res: Response, next: NextFunction) {
    const token = req.headers.authorization?.split(" ")[1] || req.headers.authorization;
    if (!token) {
        res.status(401).json({
            status: "error",
            message: "unauthorized"
        })
        return;
    }
    jwt.verify(token, process.env.JWT_SECRET as string, async (err, result) => {
        if (!result) {
            res.status(401).json({
                status: "error",
                message: "unauthorized"
            })
            return;
        }
        await prisma.session.findUnique({
            where: {
                token: token
            }
        }).then(async data => {
            if (!data) {
                res.status(401).json({
                    status: "error",
                    message: "unauthorized"
                })
                return;
            }
            next();
        })
    })
}   