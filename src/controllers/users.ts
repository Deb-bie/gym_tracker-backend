import { Request, Response } from 'express';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import prisma from '../database/db';
import { errorHandler } from '../middleware';
import { Prisma } from '@prisma/client';

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


    public loginUser = async(req: Request, res: Response, next: any) => {
        const {email, password } = req.body;

        try {
            // check if email or username is present
            if (!email && !password) {
                return errorHandler("Email and Password is required", req, res, next)
            }

            // check if email exixts
            const user = await prisma.user.findUnique({
                where: { email: email }
            });

            if (!user){
                return errorHandler("Invalid credentials", req, res, next)
            }

            const passwordMatch = await bcrypt.compare(password, user.password);

            if (!passwordMatch) {
                return errorHandler("Invalid credentials", req, res, next)
            }

            const token = jwt.sign(
                { 
                    userId: user.id, 
                    email: user.email 
                },
                JWT_SECRET,
                { expiresIn: '7d' }
            );

            res.status(200).json({
                success: true,
                data: user,
                token: token,
                message: 'User logged in successfully',
            });

        } catch (error) {
            console.log("err: ", error)
            return errorHandler(error, req, res, next)
        }
    }


    public getUserById = async(req: Request, res: Response, next: any) => {

        try {
            const { id } = req.params;
            const userId = parseInt(id);

            if (isNaN(userId)) {
                return errorHandler("Invalid user Id", req, res, next);
            }

            const user = await prisma.user.findUnique({
                where: {
                    id: userId
                },
                include: {
                    equipments: {
                        select: {
                            id: true,
                            name: true,
                            type: true,
                            description: true,
                            targetMuscles: true,
                            createdAt: true,
                            updatedAt: true,
                        },
                    },
                },
            });

            if (!user) {
                return errorHandler("User not found", req, res, next);
            }

            res.status(200).json({
                success: true,
                data: user,
                message: 'User retrieved successfully',
            });

        } catch (error) {
            console.log("err: ", error)
            return errorHandler(error, req, res, next)
        }
    }

    public updateUserDetails = async(req: Request, res: Response, next: any) => {

        try {
            const { id } = req.params;
            const { email, username } = req.body;
            const userId = parseInt(id);

            if (isNaN(userId)) {
                return errorHandler("Invalid user Id", req, res, next);
            }

            const user = await prisma.user.findUnique({ 
                where: { 
                    id: userId 
                } 
            });

            if (!user) {
                return errorHandler('User not found', req, res, next);
            }

            const data: Prisma.UserUpdateInput = {
                ...(email && { email }),
                ...(username && { username })
            };

            const updatedUser = await prisma.user.update({
                where: { 
                    id: userId 
                }, 
                data
            });

            res.status(200).json({
                success: true,
                data: updatedUser,
                message: 'User updated successfully',
            });

        } catch (error) {
            console.log("err: ", error)
            return errorHandler(error, req, res, next)
        }
    }

}


export default new UsersController();