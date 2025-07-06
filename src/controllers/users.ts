import { Request, Response } from 'express';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import prisma from '../database/db';
import { errorHandler } from '../middleware';

const JWT_SECRET = process.env.JWT_SECRET || "";

class UsersController {

    public registerUser = async(req: Request, res: Response, next: any) => {
        try {
            const {email, username, password } = req.body;

            // check if email or username is present
            if (!email && !username) {
                return errorHandler("Email and Username is required", req, res, next)
            }

            // check if email already exixts
            const existingUser = await prisma.user.findUnique({
                where: { email: email }
            });

            if (existingUser){
                return errorHandler("Email already exists", req, res, next)
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
            console.log("err: ", error)
            return errorHandler(error, req, res, next)
        }
    }

}


export default new UsersController();








