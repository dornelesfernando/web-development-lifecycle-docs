import { DataTypes, Model, Optional, Sequelize } from "sequelize";
import { Employee } from "./Employee";

interface DepartmentAttributes {
    id: string; // UUID
    name: string;
    description?: string;
    manager_id?: string; // FK UUID of the manager
}

interface DepartmentCreationAttributes extends Optional<DepartmentAttributes, 'id' | 'description' | 'manager_id'> {}

class Department extends Model<DepartmentAttributes, DepartmentCreationAttributes> implements DepartmentAttributes {
    public id!: string; // UUID
    public name!: string;
    public description?: string;
    public manaher_id?: string; // FK UUID of the manager

    // Métodos de inicialização e associação
    static initialize(sequelize: Sequelize) {
        Department.init({
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
            manager_id: {
                type: DataTypes.UUID,
                allowNull: true,
                references: {
                    model: 'employees',
                    key: 'id'
                }
            }
        }, {
            sequelize,
            tableName: 'departments',
            timestamps: false
        });
    }

    // Métodos de associação
    static associate(models: any) {
        Department.hasMany(models.Employee, {
            foreignKey: 'department_id',
            as: 'employees'
        })

        Department.belongsTo(models.Employee, {
            foreignKey: 'manager_id',
            as: 'manager'
        });
    }
}

export { Department };