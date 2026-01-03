import { Request, Response, NextFunction } from 'express';
import { Role } from '@prisma/client';
import { AppError } from './errorHandler';

export const authorize = (...allowedRoles: Role[]) => {
    return (req: Request, _res: Response, next: NextFunction): void => {
        if (!req.user) {
            throw new AppError('User not authenticated', 401);
        }

        if (!allowedRoles.includes(req.user.role)) {
            throw new AppError('You do not have permission to perform this action', 403);
        }

        next();
    };
};
