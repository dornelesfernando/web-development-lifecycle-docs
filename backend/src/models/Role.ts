import { DataTypes, Model, Optional, Sequelize } from "sequelize";
import { EmployeeRole } from "./EmployeeRole";
import { RolePermission } from "./RolePermission";

interface RoleAttributes {
    id: string; // UUID
    name: string;
    description?: string;
}

interface RoleCreationAttributes extends Optional<RoleAttributes, 'id' | 'description'> {}

class Role extends Model<RoleAttributes, RoleCreationAttributes> implements RoleAttributes {
    public id!: string;
    public name!: string;
    public description?: string;

    // Métodos de inicialização e associação
    static initialize(sequelize: Sequelize) {
        Role.init({
            id: {
                type: DataTypes.UUID,
                defaultValue: DataTypes.UUIDV4,
                primaryKey: true,
                allowNull: false
            },
            name: {
                type: DataTypes.STRING(50),
                allowNull: false,
                unique: true
            },
            description: {
                type: DataTypes.TEXT,
                allowNull: true
            }
        }, {
            sequelize,
            tableName: 'roles',
            timestamps: false
        });
    }

    // Métodos de associação
    static associate(models: any) {
        Role.hasMany(models.EmployeeRole, {
            foreignKey: 'role_id',
            as: 'employeeRoles'
        });
        Role.hasMany(models.RolePermission, {
            foreignKey: 'role_id',
            as: 'rolePermissions'
        });
    }
}

export { Role };