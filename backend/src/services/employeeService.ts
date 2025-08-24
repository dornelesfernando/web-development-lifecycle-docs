import { Employee } from '../models/Employee';
import { AppError } from '../utils/AppError';
import { sequelize } from '../models';
import bcrypt from 'bcryptjs';

import {
    CreateEmployeeDTO,
    UpdateEmployeeDTO,
    SafeEmployeeDTO,
    PaginatedEmployeesDTO
} from '../dtos/EmployeeDTOs';
import { any } from 'zod';

export class EmployeeService {
    /**
     * Cria um novo usuário, garantindo a criptografia da senha.
     * @param employeeData - DTO com os dados do novo usuário.
     * @returns O objeto do usuário criado, sem a hash da senha.
     * @throws AppError se já existir um usuário com o email cadastrado.
     * @since 0.0.26
     * @author Eng. G. Dorneles, Fernando
     */
    public async create(employeeData: CreateEmployeeDTO): Promise<SafeEmployeeDTO> {
        const { password, ...rest } = employeeData;

        const newEmployee  = await sequelize.transaction(async (t) => {
            const existingEmployee = await Employee.findOne({
                where: { email: employeeData.email },
                transaction: t
            });

            if (existingEmployee) {
                throw new AppError('Já existe um usuário cadastrado com este e-mail.', 409);
            }

            const salt = await bcrypt.genSalt(10);
            const hashedPassword = await bcrypt.hash(password, salt);

            const employee  = await Employee.create({
                ...rest,
                password_hash: hashedPassword,
                password: '',
            }, {
                transaction: t
            });

            return employee;
        });
        
        const { password_hash, password: _, ...safeEmployee } = newEmployee.toJSON();
        return safeEmployee;
    }

    /**
     * Busca um usuário pelo seu ID, incluindo associações relevantes.
     * @param id - O ID do usuário a ser buscado.
     * @returns Retorna os dados do usuário pesquisado.
     * @throws AppError se o usuário não for encontrado.
     * @since 0.0.26
     * @author Eng. G. Dorneles, Fernando
     */
    public async findById(id: string): Promise<SafeEmployeeDTO> {
        const employee = await Employee.findByPk(id, {
            attributes: {
                exclude: ['password_hash', 'password'],
            },
            include: [
                { association: 'position' },
                { association: 'department' },
                { association: 'supervisor', attributes: ['id', 'name', 'emal'] },
            ],
        });

        if (!employee) {
            throw new AppError('Usuário não encontrado.', 404);
        }

        return employee;
    }

    /**
     * Busca todos os usuários ativos com paginação.
     * @param page - O número da página a ser retornada.
     * @param limit - O número de itens por página.
     * @returns Um objeto com os dados da paginação e a lista de usuários.
     * @since 0.0.26
     * @author Eng. G. Dorneles, Fernando
    */
    public async findAll(page: number = 1, limit: number = 10): Promise<PaginatedEmployeesDTO> {
        const offset = (page - 1) * limit;

        const { count, rows } = await Employee.findAndCountAll({
            where: {is_active: true},
            limit, 
            offset, 
            attributes: {
                exclude: ['password_hash'],
            },
            order: [['name', 'ASC']],
            include: [
                { association: 'position' },
                { association: 'department' },
            ],
        });
    
        return {
            totalItems: count,
            employees: rows,
            totalPages: Math.ceil(count / limit),
            currentPage: page,
        }
    }

    /**
     * Atualiza um usuário existente
     * @param id - ID do usuário que deseja-se atualizar.
     * @param employeeData - Dados do usuário que deseja-se atualizar.
     * @returns Retorna os dados do usuário atualizado.
     * @throws AppError se o usuário não for encontado.
     * @throws AppError se já existir um usuário com o email cadastrado.
     * @since 0.0.26
     * @author Eng. G. Dorneles, Fernando
     */
    public async update(id: string, employeeData: UpdateEmployeeDTO): Promise<SafeEmployeeDTO> {
        const employeeToUpdate = await Employee.findByPk(id);

        if (!employeeToUpdate) {
            throw new AppError('Usuário não encontrado.', 404);
        }

        if (employeeData.email && employeeData.email !== employeeToUpdate.email) {
            const existingEmployee = await Employee.findOne({
                where: { email: employeeData.email }
            });

            if (existingEmployee && existingEmployee.id !== id) {
                throw new AppError('Já existe um usuário cadastrado com este e-mail.', 409);
            }
        }

        const updateData: any = { ...employeeData};

        if (employeeData.password) {
            const salt = await bcrypt.genSalt(10)
            updateData.password_hash = await bcrypt.hash(employeeData.password, salt);
            delete updateData.password;
        }

        await employeeToUpdate.update(updateData);

        const updatedEmployee = await Employee.findByPk(id, {
           attributes: {
                exclude: ['password_hash', 'password'],
            },
            include: [
                { association: 'position' },
                { association: 'department' },
                { association: 'supervisor', attributes: ['id', 'name', 'email'] },
            ],
        });

        const { password_hash, password: _, ...safeEmployee } = updatedEmployee!.toJSON();
        return safeEmployee;
    }

    /**
     * "Deleta" um usuário definindo seu status como inativo.
     * @param id - o ID do usuário que se deseja "deletar".
     * @throws AppError se o usuário não for encontrado.
     * @since 0.0.26
     * @author Eng. G. Dorneles, Fernando
     */
    public async delete(id: string): Promise<SafeEmployeeDTO> {
        const employeeToDelete = await Employee.findByPk(id);

        if (!employeeToDelete) {
            throw new AppError('Usuário não encontrado.', 404);
        }
        
        await employeeToDelete.update({ is_active: false });
        
        const { password_hash, password: _, ...safeEmployee } = employeeToDelete.toJSON();
        return safeEmployee;
    }
}