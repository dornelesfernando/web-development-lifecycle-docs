import { Options } from 'sequelize';
import dotenv from 'dotenv';

dotenv.config();

const dbConfig: Options = {
    username: process .env.DB_USER,
    password: process .env.DB_PASSWORD,
    database: process .env.DB_NAME,
    host: process.env.DB_HOST,
    port: parseInt(process.env.DB_PORT || '5432', 10),
    dialect: 'postgres',
    logging: process.env.NODE_ENV === 'development' ? console.log : false
}

export default dbConfig;