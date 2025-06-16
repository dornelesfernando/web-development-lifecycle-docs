// Declaração de módulo para estender a interface Request do Express
declare namespace Express {
    export interface Request {
        user?: {
            id: string;
            name: string;
            email: string;
            role?: string;
            roles?: string[];
            permissions?: string[];
        };
        file?: Express.Multer.File // uploads
    }
}