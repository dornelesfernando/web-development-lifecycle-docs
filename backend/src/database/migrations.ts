import {
  sequelize,
} from "./index";

async function runMigrations() {
  try {
    console.log("Iniciando a sincronização do banco de dados...");

    await sequelize.sync({ alter: true });

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