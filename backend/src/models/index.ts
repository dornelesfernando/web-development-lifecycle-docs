// src/models/index.ts

import { Sequelize } from 'sequelize';
import dbConfig  from '../config/database';

// Importe todas as suas classes de modelo
import { Attachment } from './Attachment';
import { Department } from './Department';
import { Employee } from './Employee';
import { EmployeeRole } from './EmployeeRole';
import { EmployeeTask } from './EmployeeTask';
import { HourLog } from './HourLog';
import { Permission } from './Permission';
import { Position } from './Position';
import { Project } from './Project';
import { Role } from './Role';
import { RolePermission } from './RolePermission';
import { Task } from './Task';

// Crie a instância do Sequelize
const sequelize = new Sequelize(dbConfig);

// Crie um objeto com todos os modelos para facilitar o acesso
const models = {
    Attachment,
    Department,
    Employee,
    EmployeeRole,
    EmployeeTask,
    HourLog,
    Permission,
    Position,
    Project,
    Role,
    RolePermission,
    Task
};

// --- INICIALIZAÇÃO E ASSOCIAÇÃO ---

Object.values(models).forEach(model => {
    model.initialize(sequelize);
});

Object.values(models).forEach(model => {
    if (model.associate) {
        model.associate(models);
    }
});


export {
    sequelize,
    Attachment,
    Department,
    Employee,
    EmployeeRole,
    EmployeeTask,
    HourLog,
    Permission,
    Position,
    Project,
    Role,
    RolePermission,
    Task
};