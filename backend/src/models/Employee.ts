import { DataTypes, Model, Optional, Sequelize } from 'sequelize';
import bcrypt from 'bcryptjs';

import type { Position } from './Position';
import type { Department } from './Department';
import type { Role } from './Role';
import type { EmployeeRole } from './EmployeeRole';
import { Project } from './Project';
import { Task } from './Task';
import { HourLog } from './HourLog';
import { Attachment } from './Attachment';
import { EmployeeTask } from './EmployeeTask';

interface EmployeeAttributes {
    id: string; // UUID
    name: string;
    email: string;
    password?: string;
    password_hash: string;
    cellphone?: string;
    hiring_date: Date;
    birth_date?: Date;
    address?: string;
    position_id: string; // FK Position (UUID)
    department_id: string; // FK Department (UUID)
    supervisor_id?: string; // FK Employee (UUID)
    is_active: boolean;
}

interface EmployeeCreationAttributes extends Optional<EmployeeAttributes, 'id' | 'password_hash' | 'cellphone' | 'birth_date' | 'address' | 'supervisor_id' | 'is_active'> {
    password: string;
}

class Employee extends Model<EmployeeAttributes, EmployeeCreationAttributes> implements EmployeeAttributes {
    public id!: string;
    public name!: string;
    public email!: string;
    public password!: string;
    public password_hash!: string;
    public cellphone?: string;
    public hiring_date!: Date;
    public birth_date?: Date;
    public address?: string;
    public position_id!: string;
    public department_id!: string;
    public supervisor_id?: string;
    public is_active!: boolean;

    public readonly created_at!: Date;
    public readonly updated_at!: Date;

    public readonly position?: Position;
    public readonly department?: Department;
    public readonly supervisor?: Employee;
    public readonly subordinates?: Employee[];
    public readonly managedProjects?: Project[];
    public readonly createdTasks?: Task[];
    public readonly employeeTasks?: EmployeeTask[];
    public readonly hourLogs?: HourLog[];
    public readonly approvedHourLogs?: HourLog[];
    public readonly createdAttachments?: Attachment[];
    public readonly profileAttachments?: Attachment[];
    public readonly roles?: Role[];
    public readonly employeeRoles?: EmployeeRole[];
    public readonly managedDepartment?: Department;

    // Métodos de instância
    public async comparePassword(enteredPassword: string): Promise<boolean> {
        return bcrypt.compare(enteredPassword, this.password_hash);
    }

    // Métodos de inicialização e associação
    static initialize(sequelize: Sequelize) {
        Employee.init({
            id: {
                type: DataTypes.UUID,
                defaultValue: DataTypes.UUIDV4,
                primaryKey: true,
                allowNull: false
            },
            name: {
                type: DataTypes.STRING(100),
                allowNull: false
            },
            email: {
                type: DataTypes.STRING(100),
                allowNull: false,
                unique: true,
                validate: {
                    isEmail: true
                },
            },
            password: {
                type: DataTypes.VIRTUAL
            },
            password_hash: {
                type: DataTypes.STRING(255),
                allowNull: false
            },
            cellphone: {
                type: DataTypes.STRING(20),
                allowNull: true
            },
            hiring_date: {
                type: DataTypes.DATEONLY,
                allowNull: false
            },
            birth_date: {
                type: DataTypes.DATEONLY,
                allowNull: true
            },
            address: {
                type: DataTypes.STRING(255),
                allowNull: true
            },
            position_id: {
                type: DataTypes.UUID,
                allowNull: false,
                references: {
                    model: 'positions',
                    key: 'id'
                }
            },
            department_id: {
                type: DataTypes.UUID,
                allowNull: false,
                references: {
                    model: 'departments',
                    key: 'id'
                }
            },
            supervisor_id: {
                type: DataTypes.UUID,
                allowNull: true,
                references: {
                    model: 'employees',
                    key: 'id'
                }
            },
            is_active: {
                type: DataTypes.BOOLEAN,
                defaultValue: true,
                allowNull: false
            }
        }, {
            sequelize,
            tableName: 'employees',
            timestamps: true,
            createdAt: 'created_at',
            updatedAt: 'updated_at',
            hooks: {
                beforeCreate: async (employee: Employee) => {
                    if (employee.password) {
                        const salt = await bcrypt.genSalt(10);
                        employee.password_hash = await bcrypt.hash(employee.password, salt);
                    }                
                },
                beforeUpdate: async (employee: Employee) => {
                    if (employee.password) {
                        const salt = await bcrypt.genSalt(10);
                        employee.password_hash = await bcrypt.hash(employee.password, salt);
                    }
                }
            }
        });
    }

    static associate(models: any) {
        Employee.belongsTo(models.Position, {
            foreignKey: 'position_id',
            as: 'position'
        });

        Employee.belongsTo(models.Department, {
            foreignKey: 'department_id',
            as: 'department'
        });

        Employee.belongsTo(models.Employee, {
            foreignKey: 'supervisor_id',
            as: 'supervisor'
        });

        Employee.hasMany(models.Employee, {
            foreignKey: 'supervisor_id',
            as: 'subordinates'
        });

        Employee.hasMany(models.Project, {
            foreignKey: 'manager_id',
            as: 'managedProjects'
        });

        Employee.hasMany(models.Task, {
            foreignKey: 'creator_id',
            as: 'createdTasks'
        });

        Employee.hasMany(models.EmployeeTask, {
            foreignKey: 'employee_id',
            as: 'employeeTasks'
        })

        Employee.hasMany(models.HourLog, {
            foreignKey: 'employee_id',
            as: 'hourLogs'
        })

        Employee.hasMany(models.HourLog, {
            foreignKey: 'approver_id',
            as: 'approvedHourLogs'
        })

        Employee.hasMany(models.Attachment, {
            foreignKey: 'creator_id',
            as: 'createdAttachments'
        })

        Employee.hasMany(models.Attachment, {
            foreignKey: 'employee_profile_id',
            as: 'profileAttachments'
        })

        Employee.belongsToMany(models.Role, {
            through: models.EmployeeRole, 
            foreignKey: 'employee_id', 
            otherKey: 'role_id', 
            as: 'roles'
        });

        Employee.hasMany(models.EmployeeRole, {
            foreignKey: 'employee_id',
            as: 'employeeRoles'
        })

        // Associação reversa para Department.manager_id
        Employee.hasOne(models.Department, {
            foreignKey: 'manager_id',
            as: 'managedDepartment'
        })
    }
}

export { Employee, EmployeeCreationAttributes, EmployeeAttributes };