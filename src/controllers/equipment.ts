import { Request, Response } from 'express';
import { Prisma } from '@prisma/client';
import prisma from '../database/db';
import { errorHandler } from '../middleware';
import UsersController from "./users" 

class EquipmentController {

    public addEquipment = async(req: Request, res: Response, next: any) => {
        try {
            const { name, type, description, targetMuscles} = req.body.body;
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

            const userId = isUser.id;

            if (!name && !type && !targetMuscles ){
                return errorHandler('Equipment name, type and muscles are required', req, res, next)
            }

            // check if email already exixts
            const existingequipment = await prisma.equipment.findUnique({
                where: { name: name }
            });

            if (existingequipment){
                return errorHandler("Equipment Name is already being used", req, res, next)
            }

            const newEquipment = await prisma.equipment.create({
                data: {
                    name,
                    type,
                    description,
                    userId,
                    targetMuscles: {
                        create: targetMuscles.map(
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


    public getEquipmentById = async(req: Request, res: Response, next: any) => {
        try {
            const { id } = req.params;
            const equipmentId = parseInt(id);

            if (isNaN(equipmentId)) {
                return errorHandler("Invalid equipment Id", req, res, next);
            }

            const equipment = await prisma.equipment.findUnique({
                where: {
                    id: equipmentId
                },
                include: {
                    targetMuscles: {
                        select: {
                            id: true,
                            muscle: true
                        },
                    },
                },
            });

            if (!equipment) {
                return errorHandler("Equipment not found", req, res, next);
            }
            
            res.status(201).json({
                success: true,
                data: equipment,
                message: 'Equipment retrieved successfully',
            });
        } catch (error) {
            errorHandler(error, req, res, next)
            console.log("err: ", error)
        }
    }

    public getAllEquipments = async(req: Request, res: Response, next: any) => {
        try {
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

            const equipments = await prisma.equipment.findMany({
                include: {
                    targetMuscles: {
                        select: {
                            id: true,
                            muscle: true
                        },
                    },
                },
            });
            
            res.status(200).json({
                success: true,
                data: equipments,
                message: 'Equipments retrieved successfully',
            });
        } catch (error) {
            errorHandler(error, req, res, next)
            console.log("err: ", error)
        }
    }

    public editEquipmentDetails = async(req: Request, res: Response, next: any) => {

        try {
            const { id } = req.params;
            const { name, type, description, targetMuscles } = req.body;
            const equipmentId = parseInt(id);

            if (isNaN(equipmentId)) {
                return errorHandler("Invalid equipment Id", req, res, next);
            }

            const equipment = await prisma.equipment.findUnique({ 
                where: { 
                    id: equipmentId 
                } 
            });

            if (!equipment) {
                return errorHandler('Equipment not found', req, res, next);
            }

            const data: Prisma.EquipmentUpdateInput = {
                ...(name && { name }),
                ...(type && { type }),
                ...(description && { description }),
                ...(targetMuscles && { targetMuscles })
            };

            const updatedEquipment = await prisma.equipment.update({
                where: { 
                    id: equipmentId 
                }, 
                data
            });

            res.status(200).json({
                success: true,
                data: updatedEquipment,
                message: 'Equipment updated successfully',
            });

        } catch (error) {
            console.log("err: ", error)
            return errorHandler(error, req, res, next)
        }
    }

    public deleteEquipment = async(req: Request, res: Response, next: any) => {   

        try {
            const token  = req.headers.authorization?.split(' ')[1];
            const { id } = req.params;
            const equipmentId = parseInt(id);

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

            if (isNaN(equipmentId)) {
                return errorHandler("Invalid equipment Id", req, res, next);
            }

            const equipment = await prisma.equipment.findUnique({ 
                where: { 
                    id: equipmentId 
                } 
            });

            if (!equipment) {
                return errorHandler('Equipment not found', req, res, next);
            }

            await prisma.$transaction([
                prisma.targetMuscle.deleteMany({
                    where: {
                        equipment: {
                            id: equipmentId 
                        }
                    }
                }),

                prisma.equipment.delete({ 
                    where: { 
                        id: equipmentId
                    } 
                })
            ]);

            res.status(200).json({
                success: true,
                message: 'Equipment deleted successfully',
            });

        } catch (error) {
            console.log("err: ", error)
            return errorHandler(error, req, res, next)
        }
    }
    
}


export default new EquipmentController();
