import { Options } from 'sequelize';
import dotenv from 'dotenv';

dotenv.config();

const dbConfig: Options = {
    username: process.env.DB_USER as string,
    password: process.env.DB_PASSWORD as string,
    database: process.env.DB_NAME as string,
    host: process.env.DB_HOST as string,
    port: parseInt(process.env.DB_PORT || '5432', 10),
    dialect: 'postgres',
    logging: process.env.NODE_ENV === 'development' ? console.log : false,
    timezone: '-03:00'
}

export default dbConfig;