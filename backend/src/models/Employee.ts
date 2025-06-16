import { DataTypes, Model, Optional, Sequelize } from 'sequelize';
import bcrypt from 'bcryptjs';
import { Position } from './Position';
import { Department } from './Department';
import { Role } from './Role';
import { EmployeeRole } from './EmployeeRole';

interface EmployeeAttributes {
    id: string; // UUID
    name: string;
    email: string;
    password_hash: string;
    cellphone?: string;
    hiring_date: Date;
    birth_date?: Date;
    address?: string;
    position_id: string; // FK Position (UUID)
    department_id: string; // FK Department (UUID)
    supervisor_id?: string; // FK Employee (UUID)
    is_active: boolean;
    created_at?: Date;
    updated_at?: Date;
}

interface EmployeeCreationAttributes extends Optional<EmployeeAttributes, 'id' | 'cellphone' | 'birth_date' | 'address' | 'supervisor_id' | 'is_active' | 'created_at' | 'updated_at'> {}

class Employee extends Model<EmployeeAttributes, EmployeeCreationAttributes> implements EmployeeAttributes {
    public id!: string;
    public name!: string;
    public email!: string;
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
                }
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
            },
            created_at: {
                type: DataTypes.DATE,
                defaultValue: DataTypes.NOW,
                allowNull: false
            },
            updated_at: {
                type: DataTypes.DATE,
                defaultValue: DataTypes.NOW,
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
                    if (employee.password_hash) {
                        const salt = await bcrypt.genSalt(10);
                        employee.password_hash = await bcrypt.hash(employee.password_hash, salt);
                    }                
                },
                beforeUpdate: async (employee: Employee) => {
                    if (employee.changed('password_hash') && employee.password_hash) {
                        const salt = await bcrypt.genSalt(10);
                        employee.password_hash = await bcrypt.hash(employee.password_hash, salt);
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

        Employee.hasMany(models.EmployeeRole, {
            foreignKey: 'employee_id',
            as: 'employeeRoles'
        })

        // Associação reversa para Department.menager_id
        Employee.hasOne(models.Department, {
            foreignKey: 'manager_id',
            as: 'managedDepartment'
        })
    }
}

export { Employee };