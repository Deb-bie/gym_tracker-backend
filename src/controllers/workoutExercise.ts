import { Request, Response } from 'express';

import { errorHandler } from "../middleware";
import UsersController from "./users"
import prisma from '../database/db';


class WorkoutExerciseController {
    public addWorkoutExercise = async(req: Request, res: Response, next: any) => {
        try {
            const { equipmentId, workoutSessionId, sets , notes} = req.body;
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

            if (!equipmentId || !workoutSessionId || !sets) {
                return errorHandler("Sets is required", req, res, next)
            }

            const equipment = await prisma.equipment.findFirst({
                where: {
                    id: equipmentId,
                    userId: isUser.id
                }
            })

            if (!equipment) {
                return errorHandler("Equipment not found for this user", req, res, next)
            }

            const workoutSession = await prisma.workoutSession.findFirst({
                where: {
                    id: workoutSessionId,
                    userId: isUser.id
                }
            })

            if (!workoutSession) {
                return errorHandler("Equipment not found for this user", req, res, next)
            }

            const workoutExercise = await prisma.workoutExercise.create({
                data: {
                    equipmentId, workoutSessionId, notes,
                    sets: {
                        create: sets.map(
                            (set: any) => ({set: set})
                        )
                    }
                },
                include: {
                    sets: true
                }
            });

            res.status(201).json({
                success: true,
                data: workoutExercise,
                message: 'Workout exercise created successfully',
            });
        } catch (error) {
            errorHandler(error, req, res, next)
            console.log("err: ", error)
        }
    }
}

export default new WorkoutExerciseController();