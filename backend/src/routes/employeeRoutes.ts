import { Router } from "express";
import {
    createEmployee,
    getAllEmployees
} from '../controllers/employeeController';
import { validate } from '../middleware/validateMiddleware';
import { createEmployeeSchema, getEmployeesSchema } from '../validations/employeeValidation';

const router = Router();

router.post('/', validate(createEmployeeSchema), createEmployee);

router.get('/', validate(getEmployeesSchema), getAllEmployees);

export default router;