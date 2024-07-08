import { Router } from "express";
const auth = Router();
import prisma from "../utils/db";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import verifyAuth from "../middlewares/verifyAuth";


// 3 char min, 16 max, all letters, only lower dash and dot allowed
const usernameRegex = /^[A-Za-z\d_.]{3,16}$/;
// 8 char min, one uppercase letter, one lowercase, at least 1 digit, at least 1 special character
const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;

auth.post("/register", async (req, res) => {
    const { username, password } = req.body;
    if (!username || !password) {
        res.status(400).json({
            status: "error",
            message: "missing_parameters"
        });
        return;
    }
    if (!usernameRegex.test(username)) {
        res.status(200).json({
            status: "error",
            message: "invalid_username"
        });
        return;
    }
    if (!passwordRegex.test(password)) {
        res.status(200).json({
            status: "error",
            message: "invalid_password"
        });
        return;
    }
    bcrypt.hash(password, 12, async (err, hashedPassword) => {
        if (err) {
            console.log(err)
            res.sendStatus(500)
            return;
        }
        await prisma.user.create({
            data: {
                name: username,
                password: hashedPassword,
            }
        }).then(async () => {
            res.status(200).json({
                "status": "success",
                "message": "user_created"
            })
            return;
        }).catch(async err => {
            switch (err.code) {
                case "P2002":
                    res.status(400).json({
                        status: "error",
                        message: "username_taken"
                    })
                    break;
                default:
                    res.sendStatus(500)
                    break;
            }

        })
    })
})

auth.post("/login", async (req, res) => {
    const { username, password } = req.body;
    if (!username || !password) {
        res.status(400).json({
            status: "error",
            message: "missing_parameters"
        });
        return;
    }
    await prisma.user.findUnique({
        where: {
            name: username
        }
    }).then(async (data) => {
        if (!data) {
            res.status(401).json({
                "status": "error",
                "message": "failed_login"
            });

            return;
        }
        bcrypt.compare(password, data.password, async (err, result) => {
            if (!result) {
                res.status(401).json({
                    "status": "error",
                    "message": "failed_login"
                });

                return;
            }
            jwt.sign({
                id: data.id
            }, process.env.JWT_SECRET as string, async function (err: any, token: any) {
                // write token in session table
                await prisma.session.create({
                    data: {
                        token: token,
                        userId: data.id
                    }
                }).then(async () => {
                    res.status(200).json({
                        status: "success",
                        token: token
                    })
                    return;
                })
            });
        })
    })
})

auth.post("/logout", verifyAuth, async (req, res) => {
    const token = req.headers.authorization?.split(" ")[1] || req.headers.authorization;
    await prisma.session.delete({
        where: {
            token: token
        }
    }).then(() => {
        res.status(200).json({
            status: "success",
            message: "logged_out"
        })
    }).catch(() => {
        res.status(500).json({
            "status": "error",
            "message": "internal_server_error"
        });
    })
})

export default auth;