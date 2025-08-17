import { DataTypes, Model, Optional, Sequelize } from "sequelize";
import type { Employee } from "./Employee";
import type { Task } from "./Task";
import type { Project } from "./Project";

interface AttachmentAttributes {
    id: string; // UUID
    file_name: string;
    storage_path: string;
    mime_type: string;
    size_bytes: number;
    creator_id: string; // UUID of the employee
    task_id?: string; // UUID of the task
    project_id?: string; // UUID of the project
    employee_profile_id?: string; // UUID of the employee (profile attachment)
}

interface AttachmentCreationAttributes extends Optional<AttachmentAttributes, 'id' | 'task_id' | 'project_id' | 'employee_profile_id'> {}

class Attachment extends Model<AttachmentAttributes, AttachmentCreationAttributes> implements AttachmentAttributes {
    public id!: string;
    public file_name!: string;
    public storage_path!: string;
    public mime_type!: string;
    public size_bytes!: number;
    public creator_id!: string;
    public task_id?: string;
    public project_id?: string;
    public employee_profile_id?: string;

    public readonly created_at!: Date;
    public readonly updated_at!: Date;

    public readonly creator?: Employee;
    public readonly task?: Task;
    public readonly project?: Project;
    public readonly employeeProfile?: Employee;

    // Métodos de inicialização e associação
    static initialize(sequelize: Sequelize) {
        Attachment.init({
            id: {
                type: DataTypes.UUID,
                defaultValue: DataTypes.UUIDV4,
                primaryKey: true,
                allowNull: false
            },
            file_name: {
                type: DataTypes.STRING(255),
                allowNull: false
            },
            storage_path: {
                type: DataTypes.STRING(255),
                allowNull: false,
                unique: true
            },
            mime_type: {
                type: DataTypes.STRING(50),
                allowNull: false
            },
            size_bytes: {
                type: DataTypes.BIGINT,
                allowNull: false
            },
            creator_id: {
                type: DataTypes.UUID,
                allowNull: false,
                references: {
                    model: 'employees',
                    key: 'id'
                }
            },
            task_id: {
                type: DataTypes.UUID,
                allowNull: true,
                references: {
                    model: 'tasks',
                    key: 'id'
                }
            },
            project_id: {
                type: DataTypes.UUID,
                allowNull: true,
                references: {
                    model: 'projects',
                    key: 'id'
                }
            },
            employee_profile_id: {
                type: DataTypes.UUID,
                allowNull: true,
                references: {
                    model: 'employees',
                    key: 'id'
                }
            }
        }, {
                sequelize,
                tableName: 'attachments',
                timestamps: true,
                createdAt: 'created_at',
                updatedAt: 'updated_at'
        });
    }

    // Métodos de associação
    static associate(models: any) {
        Attachment.belongsTo(models.Employee, {
            foreignKey: 'creator_id',
            as: 'creator'
        })

        Attachment.belongsTo(models.Task, {
            foreignKey: 'task_id',
            as: 'task'
        })

        Attachment.belongsTo(models.Project, {
            foreignKey: 'project_id',
            as: 'project'
        })

        Attachment.belongsTo(models.Employee, {
            foreignKey: 'employee_profile_id',
            as: 'employeeProfile'
        })
    }
}

export { Attachment };