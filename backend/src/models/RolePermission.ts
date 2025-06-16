import { DataTypes, Model, Optional, Sequelize } from "sequelize";
import { Role } from "./Role";
import { Permission } from "./Permission";

interface RolePermissionAttributes {
    id: string; // UUID
    role_id: string; // UUID referencing roles table
    permission_id: string; // UUID referencing permissions table
}

interface RolePermissionCreationAttributes extends Optional<RolePermissionAttributes, 'id'> {}

class RolePermission extends Model<RolePermissionAttributes, RolePermissionCreationAttributes> implements RolePermissionAttributes {
    public id!: string;
    public role_id!: string;
    public permission_id!: string;

    // Métodos de inicialização e associação
    static initialize(sequelize: Sequelize) {
        RolePermission.init({
            id: {
                type: DataTypes.UUID,
                defaultValue: DataTypes.UUIDV4,
                primaryKey: true,
                allowNull: false
            },
            role_id: {
                type: DataTypes.UUID,
                allowNull: false,
                references: {
                    model: 'roles',
                    key: 'id'
                }
            },
            permission_id: {
                type: DataTypes.UUID,
                allowNull: false,
                references: {
                    model: 'permissions',
                    key: 'id'
                }
            }
        }, {
            sequelize,
            tableName: 'role_permissions',
            timestamps: false,
            indexes: [{
                unique: true,
                fields: ['role_id', 'permission_id']
            }]
        });
    }

    // Métodos de associação
    static associate(models: any) {
        RolePermission.belongsTo(models.Role, { 
            foreignKey: 'role_id',
            as: 'role'
        });
        RolePermission.belongsTo(models.Permission, { 
            foreignKey: 'permission_id',
            as: 'permission'
        });
    }
}

export { RolePermission };