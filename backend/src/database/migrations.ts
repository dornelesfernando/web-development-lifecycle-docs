import {
  sequelize,
  HourLog,
  Employee,
  Position,
  Department,
  Project,
  Task,
  EmployeeTask,
  Attachment,
  Role,
  Permission,
  RolePermission,
  EmployeeRole,
} from "./index";

async function runMigrations() {
  try {
    console.log("Iniciando a sincronização do banco de dados...");

    // Nível 0: Tabelas totalmente independentes.
    await Position.sync({ alter: true });
    await Role.sync({ alter: true });
    await Permission.sync({ alter: true });
    
    // Nível 1: Tabelas que dependem apenas do Nível 0.
    await Department.sync({ alter: true });
    await RolePermission.sync({ alter: true }); // Depende de Role e Permission.

    // Nível 2: Tabela principal 'Employee', que depende de tabelas dos níveis anteriores.
    await Employee.sync({ alter: true }); // Depende de Position e Department.

    // Nível 3: Tabelas que dependem de 'Employee'.
    await Project.sync({ alter: true }); // Depende de Employee (manager_id).
    await EmployeeRole.sync({ alter: true }); // Depende de Employee e Role.

    // Nível 4: Tabela 'Task', que depende de 'Project' e 'Employee'.
    await Task.sync({ alter: true }); // Depende de Project e Employee.

    // Nível 5: Tabelas finais que dependem de 'Task' e outras.
    await EmployeeTask.sync({ alter: true }); // Depende de Employee e Task.
    await HourLog.sync({ alter: true }); // Depende de Employee e Task.
    await Attachment.sync({ alter: true }); // Depende de Employee, Task, e Project.

    console.log("Database synced successfully. All tables created/updated.");
  } catch (error) {
    console.error("Error syncing database:", error);
    process.exit(1);
  } finally {
    await sequelize.close();
  }
}

runMigrations()
  .then(() => console.log("Script de migração finalizado."))
  .catch((error) => console.log("Falha na execução do script de migração:", error));