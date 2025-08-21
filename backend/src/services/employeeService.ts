import { Employee, EmployeeCreationAttributes } from '../models/Employee';
import { AppError } from '../utils/AppError';
import { sequelize } from '../models';
import { EmployeeAttributes } from '../models/Employee';

type SafeEmployeeAttributes = Omit<EmployeeAttributes, 'password_hash' | 'password'>;

export class EmployeeService {
    public async Create(employeeData: EmployeeCreationAttributes): Promise<SafeEmployeeAttributes> {
        const newEmployee  = await sequelize.transaction(async (t) => {
            const existingEmployee = await Employee.findOne({
                where: { email: employeeData.email },
                transaction: t
            });

            if (existingEmployee) {
                throw new AppError('Já existe um usuário cadastrado com este e-mail.', 409);
            }

            const employee = await Employee.create(employeeData, {
                transaction: t
            });

            return employee;
        });
        
        const { password_hash, password, ...safeEmployee } = newEmployee.toJSON();
        return safeEmployee;
    }

    public async findAll(page: number = 1, limit: number = 10) {
        const offset = (page - 1) * limit;
    }

    /*public async findById(id: string) {}*/

    /*public async update(id: string, employeeData: IUpdateEmployeeDTO) {}*/

    /*public async delete(id: string) {}*/
}