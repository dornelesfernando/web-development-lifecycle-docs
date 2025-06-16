import { DataTypes, Model, Optional, Sequelize } from "sequelize";
import { RolePermission } from "./RolePermission";

interface PermissionAttributes {
    id: string; // UUID
    name: string;
    description?: string;
}

interface PermissionCreationAttributes extends Optional<PermissionAttributes, 'id' | 'description'> {}

class Permission extends Model<PermissionAttributes, PermissionCreationAttributes> implements PermissionAttributes {
    public id!: string;
    public name!: string;
    public description?: string;

    // Métodos de inicialização e associação
    static initialize(sequelize: Sequelize) {
        Permission.init({
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
            }
        }, {
            sequelize,
            modelName: 'permissions',
            timestamps: false
        });
    }

    // Métodos de associação
    static associate(models: any) {
        Permission.hasMany(models.RolePermission, {
            foreignKey: 'permission_id',
            as: 'rolePermissions'
        })
    }
}

export { Permission };