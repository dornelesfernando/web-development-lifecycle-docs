import { Request, Response, NextFunction } from "express";
import { EmployeeService } from "../services/employeeService";

const employeeService = new EmployeeService();

export const createEmployee = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const newEmployee = await employeeService.Create(req.body);
        res.status(201).json(newEmployee);
    } catch (error) {
        next(error);
    }
};

export const getAllEmployees = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const employeeService = new EmployeeService();
        const employees = await employeeService.findAll();

        return res.status(200).json(employees);
    } catch (error) {
        next(error);
    }
};

// getEmployeeById

// updateEmployee

// deleteEmployee

