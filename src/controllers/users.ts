import { Request, Response } from 'express';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
import prisma from '../database/db';
import { errorHandler } from '../middleware';
dotenv.config();

const JWT_SECRET = process.env.JWT_SECRET || "";

class UsersController {

    public registerUser = async(req: Request, res: Response, next: any) => {
        try {
            const {email, username, password } = req.body;

            // check if email or username is present
            if (!email && !username) {
                errorHandler("Email and Username is required", req, res, next)
                res.status(400).json({
                    success: false,
                    error: 'Email is required',
                });
                return;
            }

            // check if email already exixts
            const existingUser = await prisma.user.findUnique({
                where: { email: email }
            });

            if (existingUser){
                errorHandler("Email already exists", req, res, next)

                res.status(400).json({
                    success: false,
                    error: 'Email already exists',
                });

                return;
            }

            const hashedPassword = await bcrypt.hash(password, 10);

            const newUser = await prisma.user.create({
                data: {
                email,
                username,
                password: hashedPassword
                },
            });

            const token = jwt.sign(
                { 
                    userId: newUser.id, 
                    email: newUser.email 
                },
                JWT_SECRET,
                { expiresIn: '7d' }
            );

            res.status(201).json({
                success: true,
                data: newUser,
                token: token,
                message: 'User created successfully',
            });

        } catch (error) {
            errorHandler(error, req, res, next)
            console.log("err: ", error)
        }
    }
}


export default new UsersController();





