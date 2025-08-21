import { Employee, EmployeeCreationAttributes, EmployeeAttributes} from '../models/Employee';
import { AppError } from '../utils/AppError';
import { sequelize } from '../models';
import bcrypt from 'bcryptjs';

type SafeEmployeeAttributes = Omit<EmployeeAttributes, 'password_hash'>;

export class EmployeeService {
    /**
     * Cria um novo funcionário, garantindo a criptografia da senha.
     */
    public async create(employeeData: EmployeeCreationAttributes): Promise<SafeEmployeeAttributes> {
        const newEmployee  = await sequelize.transaction(async (t) => {
            const existingEmployee = await Employee.findOne({
                where: { email: employeeData.email },
                transaction: t
            });

            if (existingEmployee) {
                throw new AppError('Já existe um usuário cadastrado com este e-mail.', 409);
            }

            const salt = await bcrypt.genSalt(10);
            const hashedPassword = await bcrypt.hash(employeeData.password, salt);

            const employee  = await Employee.create({
                ...employeeData,
                password_hash: hashedPassword,
            }, {
                transaction: t
            });

            return employee;
        });
        
        const { password_hash, ...safeEmployee } = newEmployee.toJSON();
        return safeEmployee;
    }

    /**
     * Busca todos os funcionários ativos com paginação.
     * @param page - O número da página a ser retornada.
     * @param limit - O número de itens por página.
     * @returns Um objeto com os dados da paginação e a lista de funcionários.
    */
    public async findAll(page: number = 1, limit: number = 10): Promise<{
        totalItems: number;
        employees: SafeEmployeeAttributes[];
        totalPages: number;
        currentPage: number;
    }> {
        const offset = (page - 1) * limit;

        const { count, rows } = await Employee.findAndCountAll({
            where: {is_active: true},
            limit, 
            offset, 
            attributes: {
                exclude: ['password_hash'],
            },
            order: [['name', 'ASC']]
        });
    
        return {
            totalItems: count,
            employees: rows,
            totalPages: Math.ceil(count / limit),
            currentPage: page,
        }
    }

    /*public async findById(id: string) {}*/

    /*public async update(id: string, employeeData: IUpdateEmployeeDTO) {}*/

    /*public async delete(id: string) {}*/
}