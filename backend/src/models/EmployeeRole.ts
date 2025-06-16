import { DataTypes, Model, Optional, Sequelize } from "sequelize";
import { Employee } from "./Employee";
import { Role } from "./Role";

interface EmployeeRoleAttributes {
    id: string; // UUID
    employee_id: string; // UUID to the employee
    role_id: string; // UUID to the role
}

interface EmployeeRoleCreationAttributes extends Optional<EmployeeRoleAttributes, 'id'> {}

class EmployeeRole extends Model<EmployeeRoleAttributes, EmployeeRoleCreationAttributes> implements EmployeeRoleAttributes {
    public id!: string;
    public employee_id!: string;
    public role_id!: string;

    // Métodos de inicialização e associação
    static initialize(sequelize: Sequelize) {
        EmployeeRole.init({
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
            role_id: {
                type: DataTypes.UUID,
                allowNull: false,
                references: {
                    model: 'roles',
                    key: 'id'
                }
            }
        }, {
            sequelize,
            tableName: 'employee_roles',
            timestamps: false,
            indexes: [{
                unique: true,
                fields: ['employee_id', 'role_id']
            }]
        });
    }

    // Métodos de associação
    static associate(models: any) {
        EmployeeRole.hasMany(models.Employee, {
            foreignKey: 'employee_id',
            as: 'employee'
        })

        EmployeeRole.hasMany(models.Role, {
            foreignKey: 'role_id',
            as: 'role'
        })
    }
}

export { EmployeeRole };