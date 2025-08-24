import { Request, Response, NextFunction } from "express";
import { EmployeeService } from "../services/employeeService";
import { CreateEmployeeDTO, UpdateEmployeeDTO } from "../dtos/EmployeeDTOs";

const employeeService = new EmployeeService();

export class EmployeeController {
    public async create(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const employeeData: CreateEmployeeDTO = req.body;
            const newEmployee = await employeeService.create(employeeData);
            res.status(201).json(newEmployee);
        } catch (error: any) {
            next(error);
        }
    };

    public async findById(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const { id } = req.params;
            const employee = await employeeService.findById(id);
            res.status(200).json(employee);
        } catch (error) {
            next(error)
        }
    }

    public async findAll (req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const page = req.query.page ? parseInt(req.query.page as string) : 1;
            const limit = req.query.limit ? parseInt(req.query.limit as string) : 10;

            const employees = await employeeService.findAll(page, limit);
            res.status(200).json(employees);
        } catch (error) {
            next(error);
        }
    };

    public async update (req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const { id } = req.params;
            const employeeData: UpdateEmployeeDTO = req.body;
            const updatedEmployee = await employeeService.update(id, employeeData);
            res.status(200).json(updatedEmployee);
        } catch (error) {
            next(error)
        }
    }

    public async delete (req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const { id } = req.params;
            await employeeService.delete(id);
            res.status(204).end();
        } catch (error) {
            next(error)
        }
    }
}