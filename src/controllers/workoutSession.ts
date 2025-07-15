import { Request, Response } from 'express';
import { Prisma } from '@prisma/client';
import prisma from '../database/db';
import { errorHandler } from '../middleware';
import UsersController from "./users" 

class WorkoutSessionController {

    public createWorkoutSession = async(req: Request, res: Response, next: any) => {
        try {
            const { exercises, date, startTime, endTime, notes} = req.body;
            const token = req.headers.authorization?.split(' ')[1];

            if (!token) {
                return errorHandler("Unauthorized", req, res, next)
            }

            const isTokenValid = await UsersController.verifyToken(token);

            if (!isTokenValid) {
                return errorHandler("Token not valid", req, res, next)
            }

            const isUser = await prisma.user.findUnique({
                where: {
                    email: isTokenValid.email
                },
                select: {
                    id: true,
                    username: true,
                    email: true
                }
            })

            if (!isUser) {
                return errorHandler("User not found", req, res, next)
            }

            const userId = isUser.id;

            const workoutSession = await prisma.workoutSession.create({
                data: {
                    date, startTime, endTime, notes, userId,
                    // workoutExercises: {
                    //     create: exercises.map(
                    //         (exercise: string) => ({exercise: exercise})
                    //     )
                    // }
                },
                include: {
                    workoutExercises: true
                }
            });

            res.status(201).json({
                success: true,
                data: workoutSession,
                message: 'Workout Session created successfully',
            });
        } catch (error) {
            errorHandler(error, req, res, next)
            console.log("err: ", error)
        }
    }

    public getWorkoutSessionById = async(req: Request, res: Response, next: any) => {
        try {
            const { id } = req.params;
            const workoutSessionId = parseInt(id);
            const token  = req.headers.authorization?.split(' ')[1];

            if (!token) {
                return errorHandler("Unauthorized", req, res, next)
            }

            const isTokenValid = await UsersController.verifyToken(token);

            if (!isTokenValid) {
                return errorHandler("Token not valid", req, res, next)
            }

            const isUser = await prisma.user.findUnique({
                where: {
                    email: isTokenValid.email
                },
                select: {
                    id: true,
                    username: true,
                    email: true
                }
            })

            if (!isUser) {
                return errorHandler("User not found", req, res, next)
            }

            if (isNaN(workoutSessionId)) {
                return errorHandler("Invalid workout session Id", req, res, next);
            }

            const workout = await prisma.workoutSession.findUnique({
                where: {
                    id: workoutSessionId
                },
                include: {
                    workoutExercises: {
                        select: {
                            id: true,
                            equipment: true,
                            sets: true
                        },
                    },
                },
            });

            if (!workout) {
                return errorHandler("Workout session not found", req, res, next);
            }
            
            res.status(200).json({
                success: true,
                data: workout,
                message: 'Workout retrieved successfully',
            });
        } catch (error) {
            errorHandler(error, req, res, next)
            console.log("err: ", error)
        }
    }

    
    public endWorkoutSession = async(req: Request, res: Response, next: any) => {
        try {
            const { id } = req.params;
            const {endTime } = req.body.body;
            const workoutSessionId = parseInt(id);
            const token  = req.headers.authorization?.split(' ')[1];

            if (!token) {
                return errorHandler("Unauthorized", req, res, next)
            }

            const isTokenValid = await UsersController.verifyToken(token);

            if (!isTokenValid) {
                return errorHandler("Token not valid", req, res, next)
            }

            const isUser = await prisma.user.findUnique({
                where: {
                    email: isTokenValid.email
                },
                select: {
                    id: true,
                    username: true,
                    email: true
                }
            })

            if (!isUser) {
                return errorHandler("User not found", req, res, next)
            }

            if (isNaN(workoutSessionId)) {
                return errorHandler("Invalid workout session Id", req, res, next);
            }

            const workout = await prisma.workoutSession.findUnique({
                where: {
                    id: workoutSessionId
                },
                include: {
                    workoutExercises: {
                        select: {
                            id: true,
                            equipment: true,
                            sets: true
                        },
                    },
                },
            });

            if (!workout) {
                return errorHandler("Workout Session not found", req, res, next);
            }

            const updateWorkoutSession = await prisma.workoutSession.update({
                where: {
                    id: workoutSessionId
                },
                data: {
                    endTime
                }

            });
            
            res.status(200).json({
                success: true,
                data: updateWorkoutSession,
                message: 'Workout updated successfully',
            });
        } catch (error) {
            errorHandler(error, req, res, next)
            console.log("err: ", error)
        }
    }
    
}


export default new WorkoutSessionController();

