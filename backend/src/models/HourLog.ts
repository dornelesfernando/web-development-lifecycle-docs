import { DataTypes, Model, Optional, Sequelize } from 'sequelize';
import type { Task } from './Task';
import type { Employee } from './Employee';

interface HourLogAttributes {
    id: string; // UUID
    task_id: string; // UUID of the task
    employee_id: string; // UUID of the employee who logged the hours
    log_date: Date;
    hours_worked: number;
    description?: string;
    approval_status: 'pending' | 'approved' | 'rejected';
    approver_id?: string; // UUID of the employee, may be null
    approval_date?: Date;
}

interface HourLogCreationAttributes extends Optional<HourLogAttributes, 'id' | 'description' | 'approval_status' | 'approver_id' | 'approval_date'> {}

class HourLog extends Model<HourLogAttributes, HourLogCreationAttributes> implements HourLogAttributes {
    public id!: string;
    public task_id!: string;
    public employee_id!: string;
    public log_date!: Date;
    public hours_worked!: number;
    public description?: string;
    public approval_status!: 'pending' | 'approved' | 'rejected';
    public approver_id?: string;
    public approval_date?: Date;

    public readonly created_at!: Date;
    public readonly updated_at!: Date;

    public readonly task?: Task;
    public readonly employee?: Employee;
    public readonly approver?: Employee;

    // Métodos de inicialização e associação
    static initialize(sequelize: Sequelize) {
        HourLog.init({
            id: {
                type: DataTypes.UUID,
                defaultValue: DataTypes.UUIDV4,
                primaryKey: true,
                allowNull: false
            },
            task_id: {
                type: DataTypes.UUID,
                allowNull: false,
                references: {
                    model: 'tasks',
                    key: 'id'
                }
            },
            employee_id: {
                type: DataTypes.UUID,
                allowNull: false,
                references: {
                    model: 'employees',
                    key: 'id'
                }
            },
            log_date: {
                type: DataTypes.DATEONLY,
                allowNull: false
            },
            hours_worked: {
                type: DataTypes.DECIMAL(5, 2),
                allowNull: false
            },
            description: {
                type: DataTypes.TEXT,
                allowNull: true
            },
            approval_status: {
                type: DataTypes.ENUM('pending', 'approved', 'rejected'),
                allowNull: false,
                defaultValue: 'pending'
            },
            approver_id: {
                type: DataTypes.UUID,
                allowNull: true,
                references: {
                    model: 'employees',
                    key: 'id'
                }
            },
            approval_date: {
                type: DataTypes.DATE,
                allowNull: true
            }
        }, {
            sequelize,
            tableName: 'hour_logs',
            timestamps: true,
            createdAt: 'created_at',
            updatedAt: 'updated_at'
        });
    }

    // Métodos de associação
    static associate(models: any) {
        HourLog.belongsTo(models.Employee, {
            foreignKey: 'task_id',
            as: 'task'
        })

        HourLog.belongsTo(models.Employee, {
            foreignKey: 'employee_id',
            as: 'employee'
        })

        HourLog.belongsTo(models.Task, {
            foreignKey: 'approver_id',
            as: 'approver'
        })
    }
}

export { HourLog };