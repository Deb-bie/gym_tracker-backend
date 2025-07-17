import { Request, Response } from 'express';
import prisma from '../database/db';
import { errorHandler } from '../middleware';
import UsersController from "./users" 
import { ProgressData } from './shared';

class ProgressController {
    public getProgressData = async (req: Request, res: Response, next: any) => {
        try {
            const token  = req.headers.authorization?.split(' ')[1];
            const { id } = req.params;
            const equipmentId = parseInt(id);

            if (isNaN(equipmentId)) {
                return errorHandler("Invalid equipment Id", req, res, next);
            }

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

            const equipment = await prisma.equipment.findUnique({
                where: {
                    id: equipmentId
                },
                include: {
                    workoutExercises: {
                    include: {
                        sets: true,
                        workoutSession: true,
                    },
                    },
                },
            });

            if (!equipment) {
                return errorHandler("Equipment not found", req, res, next)
            }

            const allSets = equipment.workoutExercises.flatMap(e => e.sets);

            const maxWeight = Math.max(...allSets.map(set => set.weight), 0);

            const totalVolume = allSets.reduce((sum, set) => sum + set.reps * set.weight, 0);

            const lastWorkoutDate = equipment.workoutExercises
            .map(e => e.workoutSession.date)
            .sort((a, b) => b!.getTime() - a!.getTime())[0];

            const progress: ProgressData = {
                equipmentId: equipment.id,
                exercises: equipment.workoutExercises,
                maxWeight,
                totalVolume,
                lastWorkout: lastWorkoutDate?.toISOString() ?? '',
            };

            res.status(200).json({
                success: true,
                data: progress,
                message: 'Progress retrieved successfully',
            });
            
        } catch (error) {
            console.log("err: ", error)
            return errorHandler(error, req, res, next)
        }
    }
}

export default new ProgressController();
