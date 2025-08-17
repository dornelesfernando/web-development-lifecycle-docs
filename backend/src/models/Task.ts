import { DataTypes, Model, Optional, Sequelize } from "sequelize";

import type { Project } from "./Project";
import type { Employee } from "./Employee";
import type { EmployeeTask } from "./EmployeeTask";
import type { HourLog } from "./HourLog";
import type { Attachment } from "./Attachment";

interface TaskAttributes {
    id: string; // UUID
    name: string;
    description?: string;
    due_date?: Date;
    priority: 'low' | 'medium' | 'high' | 'urgent' | 'critical';
    status: 'pending' | 'in_progress' | 'in_review' | 'completed' | 'on_hold' | 'cancelled' | 'archived' | 'deleted' | 'reopened' | 'waiting_for_review' | 'waiting_for_approval' | 'waiting_for_feedback' | 'waiting_for_resources' | 'waiting_for_dependencies';
    project_id?: string; // UUID of the project to which the task belongs
    creator_id: string; // UUID of the employee who created the task
}

interface TaskCreationAttributes extends Optional<TaskAttributes, 'id' | 'description' | 'due_date' | 'priority' | 'status' | 'project_id'> {}

class Task extends Model<TaskAttributes, TaskCreationAttributes> implements TaskAttributes {
    public id!: string;
    public name!: string;
    public description?: string;
    public due_date?: Date;
    public priority!: 'low' | 'medium' | 'high' | 'urgent' | 'critical';
    public status!: 'pending' | 'in_progress' | 'in_review' | 'completed' | 'on_hold' | 'cancelled' | 'archived' | 'deleted' | 'reopened' | 'waiting_for_review' | 'waiting_for_approval' | 'waiting_for_feedback' | 'waiting_for_resources' | 'waiting_for_dependencies';
    public project_id?: string; // UUID of the project to which the task belongs
    public creator_id!: string; // UUID of the employee who created the task
    
    public readonly created_at!: Date;
    public readonly updated_at!: Date;

    public readonly project?: Project;
    public readonly creator?: Employee;
    public readonly attachments?: Attachment[];
    public readonly assignedEmployees?: Employee[];
    public readonly hourLogs?: HourLog[];
    public readonly employeeTasks?: EmployeeTask[];

    // Métodos de inicialização e associação
    static initialize(sequelize: Sequelize) {
        Task.init({
            id: {
                type: DataTypes.UUID,
                defaultValue: DataTypes.UUIDV4,
                primaryKey: true,
                allowNull: false
            },
            name: {
                type: DataTypes.STRING(150),
                allowNull: false
            },
            description: {
                type: DataTypes.TEXT,
                allowNull: true
            },
            due_date: {
                type: DataTypes.DATEONLY,
                allowNull: true
            },
            priority: {
                type: DataTypes.ENUM('low', 'medium', 'high', 'urgent', 'critical'),
                allowNull: false,
                defaultValue: 'low'
            },
            status: {
                type: DataTypes.ENUM('pending', 'in_progress', 'in_review', 'completed', 'on_hold', 'cancelled', 'archived', 'deleted', 'reopened', 'waiting_for_review', 'waiting_for_approval', 'waiting_for_feedback', 'waiting_for_resources', 'waiting_for_dependencies'),
                allowNull: false,
                defaultValue: 'pending'
            },
            project_id: {
                type: DataTypes.UUID,
                allowNull: true,
                references: {
                    model: 'projects',
                    key: 'id'
                }
            },
            creator_id: {
                type: DataTypes.UUID,
                allowNull: false,
                references: {
                    model: 'employees',
                    key: 'id'
                }
            }
        }, {
            sequelize,
            tableName: 'tasks',
            timestamps: true,
            createdAt: 'created_at',
            updatedAt: 'updated_at'
        });
    }

    // Métodos de associação
    static associate(models: any) {
        Task.belongsTo(models.Project, {
            foreignKey: 'project_id',
            as: 'project'
        });

        Task.belongsTo(models.Employee, {
            foreignKey: 'creator_id',
            as: 'creator'
        });

        Task.hasMany(models.Attachment, {
            foreignKey: 'task_id',
            as: 'attachments'
        });

        Task.hasMany(models.HourLog, {
            foreignKey: 'task_id',
            as: 'hourLogs'
        });

        Task.hasMany(models.EmployeeTask, {
            foreignKey: 'task_id',
            as: 'employeeTasks'
        });

        Task.belongsToMany(models.Employee, {
            through: models.EmployeeTask,
            foreignKey: 'task_id',
            otherKey: 'employee_id',
            as: 'assignedEmployees'
        });
    }
}

export { Task };