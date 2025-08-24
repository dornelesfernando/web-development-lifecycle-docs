import { EmployeeAttributes } from '../models/Employee';

/**
 * DTO para criação de um novo funcionário.
 * Recebe apenas os campos necessários da requisição.
 */
export interface CreateEmployeeDTO {
    name: string;
    email: string;
    password: string;
    hiring_date: Date;
    position_id: string;
    department_id: string;
    cellphone?: string;
    birth_date?: Date;
    address?: string;
    supervisor_id?: string;
    is_active: boolean;
}

/**
 * DTO para a atualização de um funcionário.
 * Todos os campos são opcionais, permitindo atualizações parciais.
 */
export interface UpdateEmployeeDTO {
    name?: string;
    email?: string;
    password?: string;
    cellphone?: string;
    birth_date?: Date;
    address?: string;
    department_id: string;
    position_id: string;
    supervisor_id?: string;
    is_active: boolean;
}

/**
 * DTO para representar um funcionário de forma segura na resposta da API
 * Eclui o hash da senha e a senha virtual.
 */

export type SafeEmployeeDTO = Omit<EmployeeAttributes, 'password_hash' | 'password'>;

/**
 * DTO para representar a resposta paginada de funcionários.
 */

export interface PaginatedEmployeesDTO {
    totalItems: number;
    employees: SafeEmployeeDTO[];
    totalPages: number;
    currentPage: number;
}