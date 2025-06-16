import { sequelize } from "./index";

async function runMigrations(){
    try {
        // `alter: true` é ótimo para desenvolvimento, mas cuidado em produção para não perder dados importantes
        await sequelize.sync({alter: true});
        console.log("Database synced successfully. All tabes created/updated.");
    } catch (eror) {
        console.error("Error syncing database:", eror);
        process.exit(1);
    } finally {
        await sequelize.close();
    }
}

runMigrations()
    .then(() => console.log("Migrations completed successfully."))