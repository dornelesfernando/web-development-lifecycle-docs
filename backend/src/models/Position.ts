import { DataTypes, Model, Optional, Sequelize } from "sequelize";

interface PositionAttributes {
    id: string; // UUID
    name: string;
    description?: string;
    hierarchical_level: number;
}

interface PositionCreationAttributes extends Optional<PositionAttributes, 'id' | 'description'> {}

class Position extends Model<PositionAttributes, PositionCreationAttributes> implements PositionAttributes {
    public id!: string;
    public name!: string;
    public description?: string;
    public hierarchical_level!: number;

    // Métodos de inicialização e associação
    static initialize(sequelize: Sequelize) {
        Position.init({
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
            },
            hierarchical_level: {
                type: DataTypes.INTEGER,
                allowNull: false
            }
        }, {
                sequelize,
                tableName: 'positions',
                timestamps: false
        });
    }

    // Métodos de associação
    static associate(models: any) {
        Position.hasMany(models.Employee, { 
            foreignKey: 'position_id',
            as: 'employees'
        });
    }
}

export { Position };