import { Router } from "express";
const auth = Router();
import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();
import bcrypt from "bcrypt";


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
        }).then(() => {
            res.status(200).json({
                "status": "success",
                "message": "user_created"
            })
            return;
        }).catch(err => {
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

export default auth;