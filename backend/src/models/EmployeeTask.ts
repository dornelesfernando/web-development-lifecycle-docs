import { DataTypes, Model, Optional, Sequelize } from "sequelize";
import { Employee } from "./Employee";
import { Task } from "./Task";

interface EmployeeTaskAttributes {
    id: string; // UUID
    employee_id: string; // UUID to reference the employee
    task_id: string; // UUID to reference the task
    assignment_date: Date;
    is_main_responsible: boolean;
}

interface EmployeeTaskCreationAttributes extends Optional<EmployeeTaskAttributes, 'id' | 'assignment_date' | 'is_main_responsible'> {}

class EmployeeTask extends Model<EmployeeTaskAttributes, EmployeeTaskCreationAttributes> implements EmployeeTaskAttributes {
    public id!: string;
    public employee_id!: string; // UUID to reference the employee
    public task_id!: string; // UUID to reference the task
    public assignment_date!: Date;
    public is_main_responsible!: boolean;

    // Métodos de inicialização e associação
    static initialize(sequelize: Sequelize) {
        EmployeeTask.init({
            id: {
                type: DataTypes.UUID,
                defaultValue: DataTypes.UUIDV4,
                primaryKey: true,
                allowNull: false
            },
            employee_id: {
                type: DataTypes.UUID,
                allowNull: false,
                references: {
                    model: 'employees',
                    key: 'id'
                }
            },
            task_id: {
                type: DataTypes.UUID,
                allowNull: false,
                references: {
                    model: 'tasks',
                    key: 'id'
                }
            },
            assignment_date: {
                type: DataTypes.DATE,
                allowNull: false,
                defaultValue: DataTypes.NOW
            },
            is_main_responsible: {
                type: DataTypes.BOOLEAN,
                allowNull: false,
                defaultValue: false
            }
        }, {
                sequelize,
                tableName: 'employee_tasks',
                timestamps: false,
                indexes: [{
                    unique: true,
                    fields: ['employee_id', 'task_id'],
                }]

        });
    }

    // Métodos de associação
    static associate(models: any) {
        EmployeeTask.belongsTo(models.Employee, {
            foreignKey: 'employee_id',
            as: 'employee'
        });

        EmployeeTask.belongsTo(models.Task, {
            foreignKey: 'task_id',
            as: 'task'
        });
    }
}

export { EmployeeTask };