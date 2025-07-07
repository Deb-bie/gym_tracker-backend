import { Request, Response } from 'express';
import prisma from '../database/db';
import { errorHandler } from '../middleware';

class EquipmentController {

    public addEquipment = async(req: Request, res: Response, next: any) => {
        try {
            const { name, type, description, userId, muscles} = req.body;

            if (!name && !type && !userId && !muscles ){
                return errorHandler('Equipment name, type and muscles are required', req, res, next)
            }

            const user = await prisma.user.findUnique({
                where: { id: userId }
            });

            if (!user){
                return errorHandler('User not found', req, res, next)
            }

            const newEquipment = await prisma.equipment.create({
                data: {
                    name,
                    type,
                    description,
                    userId,
                    targetMuscles: {
                        create: muscles.map(
                            (muscle: string) => ({muscle: muscle})
                        )
                    }
                },
                include: {
                    targetMuscles: true
                }
            });
            
            res.status(201).json({
                success: true,
                data: newEquipment,
                message: 'Equipment created successfully',
            });
        } catch (error) {
            errorHandler(error, req, res, next)
            console.log("err: ", error)
        }
    }
}


export default new EquipmentController();
