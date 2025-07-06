import { Request, Response } from 'express';
import prisma from '../database/db';
import { errorHandler } from '../middleware';

class EquipmentController {

    public addEquipment = async(req: Request, res: Response, next: any) => {
        const { name, type, description, userId, muscles} = req.body;

        const user_id = req.body.userId;

        if (!user_id){
            throw "User Needed"
        }

        // check if user exists
        const user = await prisma.user.findUnique({
            where: { id: user_id }
        });

        if (!user){
            throw "User not found"
        }

        if (!req.body.name || !req.body.type) {
            next('Name and type are required')
        }   

        try {
            const newEquipment = await prisma.equipment.create({
                data: {
                    name,
                    type,
                    description,
                    userId,
                    targetMuscles: {
                        create: muscles.map((muscle: string) => ({muscle: muscle}))
                    }
                },
                include: {
                    targetMuscles: true
                }
            });
            res.status(201).json({
                success: true,
                data: newEquipment,
                message: 'Post created successfully',
            });
        } catch (error) {
            errorHandler(error, req, res, next)
            console.log("err: ", error)
        }
    }
}


export default new EquipmentController();
