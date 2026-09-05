import knex from "knex";

export const db = knex({
    client: 'mysql2',
    connection: {
        port: Number(process.env.DB_PORT) || 3306,
        host: process.env.DB_HOST || 'localhost',
        user: process.env.DB_USER || 'root',
        password: process.env.DB_PASSWORD || '',
        database: process.env.DB_NAME || 'BookSwap',
    }
})