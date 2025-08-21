import { Request, Response, NextFunction } from 'express';
import { AppError } from '../utils/AppError';


export const errorMiddleware = (
  error: Error, 
  req: Request, 
  res: Response, 
  next: NextFunction
) => {
    console.error(error);

    if (error instanceof AppError) {
        return res.status(error.statusCode).json({
            message: error.message,
            errors: error.details,
        });
    }

    return res.status(500).json({ message: 'Erro interno do servidor' });
};