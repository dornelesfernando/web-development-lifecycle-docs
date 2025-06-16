import { Sequelize  } from "sequelize";
import dbConfig from "../config/database";

// Importar TODOS os modelos
import { Employee } from '../models/Employee';
import { Position } from '../models/Position';
import { Department } from '../models/Department';
import { Project } from '../models/Project';
import { Task } from '../models/Task';
import { EmployeeTask } from '../models/EmployeeTask';
import { HourLog } from '../models/HourLog';
import { Attachment } from '../models/Attachment';
import { Role } from '../models/Role';
import { Permission } from '../models/Permission';
import { RolePermission } from '../models/RolePermission';
import { EmployeeRole } from '../models/EmployeeRole';

const sequelize = new Sequelize(dbConfig);

// Inicializar TODOS os modelos
Employee.initialize(sequelize);
Position.initialize(sequelize);
Department.initialize(sequelize);
Project.initialize(sequelize);
Task.initialize(sequelize);
EmployeeTask.initialize(sequelize);
HourLog.initialize(sequelize);
Attachment.initialize(sequelize);
Role.initialize(sequelize);
Permission.initialize(sequelize);
RolePermission.initialize(sequelize);
EmployeeRole.initialize(sequelize);

// Definit TODAS as associações
Object.values(sequelize.models).forEach(model => {
    if (typeof (model as any).associate === 'function') {
        (model as any).associate(sequelize.models);
    }
})

export {
    sequelize,
    Employee,
    Position,
    Department,
    Project,
    Task,
    EmployeeTask,
    HourLog,
    Attachment,
    Role,
    Permission,
    RolePermission,
    EmployeeRole
};