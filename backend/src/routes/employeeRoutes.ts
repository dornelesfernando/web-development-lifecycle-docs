import { Router } from "express";
import { EmployeeController } from "../controllers/employeeController";
import { validate } from '../middleware/validateMiddleware';
import { 
    createEmployeeSchema, 
    getEmployeesSchema,
    employeeIdSchema,
    updateEmployeeSchema,
} from '../validations/employeeValidation';

const router = Router();
const employeeController = new EmployeeController();

// CREATE
router.post('/', validate(createEmployeeSchema), employeeController.create.bind(employeeController));

// READ
router.get('/', validate(getEmployeesSchema), employeeController.findAll.bind(employeeController));
router.get('/:id', validate(employeeIdSchema), employeeController.findById.bind(employeeController));

// UPDATE
router.patch('/:id', validate(updateEmployeeSchema), employeeController.update.bind(employeeController));

// DELETE
router.delete('/:id', validate(employeeIdSchema), employeeController.delete.bind(employeeController));


export default router;