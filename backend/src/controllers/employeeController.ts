import { Request, Response, NextFunction } from "express";
import { EmployeeService } from "../services/employeeService";

const employeeService = new EmployeeService();

export const createEmployee = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const newEmployee = await employeeService.create(req.body);
        res.status(201).json(newEmployee);
    } catch (error) {
        next(error);
    }
};

export const getAllEmployees = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const page = req.query.page ? parseInt(req.query.page as string) : 1;
        const limit = req.query.limit ? parseInt(req.query.limit as string) : 10;

        const employees = await employeeService.findAll(page, limit);

        return res.status(200).json(employees);
    } catch (error) {
        next(error);
    }
};

// getEmployeeById

// updateEmployee

// deleteEmployee

