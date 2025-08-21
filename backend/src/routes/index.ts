import { Router } from "express";
import employeeRoutes from './employeeRoutes';

const mainRouter = Router();

mainRouter.use('/employees', employeeRoutes);

export default mainRouter;