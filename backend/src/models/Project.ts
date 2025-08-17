import { DataTypes, Model, Optional, Sequelize } from "sequelize";
import type { Employee } from "./Employee";
import type { Task } from "./Task";
import type { Attachment } from "./Attachment";

interface ProjectAttributes {
    id: string; // UUID
    name: string;
    description?: string;
    start_date: Date;
    expected_end_date?: Date;
    status: 'active' | 'completed' | 'pending' | 'cancelled' | 'archived' | 'reopened' | 'waiting_for_review' | 'waiting_for_approval' | 'waiting_for_feedback' | 'waiting_for_resources' | 'waiting_for_dependencies';
    manager_id: string; // UUID of the employee who is the manager of the project
}

interface ProjectCreationAttributes extends Optional<ProjectAttributes, 'id' | 'description' | 'expected_end_date'> {}

class Project extends Model<ProjectAttributes, ProjectCreationAttributes> implements ProjectAttributes {
    public id!: string;
    public name!: string;
    public description?: string;
    public start_date!: Date;
    public expected_end_date?: Date;
    public status!: 'active' | 'completed' | 'pending' | 'cancelled' | 'archived' | 'reopened' | 'waiting_for_review' | 'waiting_for_approval' | 'waiting_for_feedback' | 'waiting_for_resources' | 'waiting_for_dependencies';
    public manager_id!: string;

    public readonly created_at!: Date;
    public readonly updated_at!: Date;

    public readonly manager?: Employee;
    public readonly tasks?: Task[];
    public readonly attachments?: Attachment[];

    // Métodos de inicialização e associação
    static initialize(sequelize: Sequelize) {
        Project.init({
            id: {
                type: DataTypes.UUID,
                defaultValue: DataTypes.UUIDV4,
                primaryKey: true,
                allowNull: false
            },
            name: {
                type: DataTypes.STRING(100),
                allowNull: false,
                unique: true
            },
            description: {
                type: DataTypes.TEXT,
                allowNull: true
            },
            start_date: {
                type: DataTypes.DATEONLY,
                allowNull: false
            },
            expected_end_date: {
                type: DataTypes.DATEONLY,
                allowNull: true
            },
            status: {
                type: DataTypes.ENUM('active', 'completed', 'pending', 'cancelled', 'archived', 'reopened', 'waiting_for_review', 'waiting_for_approval', 'waiting_for_feedback', 'waiting_for_resources', 'waiting_for_dependencies'),
                allowNull: false,
                defaultValue: 'pending'
            },
            manager_id: {
                type: DataTypes.UUID,
                allowNull: false,
                references: {
                    model: 'employees',
                    key: 'id'
                }
            }
        }, {
            sequelize,
            tableName: 'projects',
            timestamps: true,
            createdAt: 'created_at',
            updatedAt: 'updated_at'
        });
    }

    // Métodos de associação
    static associate(models: any) {
        Project.belongsTo(models.Employee, {
            foreignKey: 'manager_id',
            as: 'manager'
        });

        Project.hasMany(models.Task, {
            foreignKey: 'project_id',
            as: 'tasks'
        });

        Project.hasMany(models.Attachment, {
            foreignKey: 'project_id',
            as: 'attachments'
        });
    }
}

export { Project };