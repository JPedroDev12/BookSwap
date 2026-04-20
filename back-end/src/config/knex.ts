import knex from "knex";

export const db = knex({
    client: 'mysql2',
    connection: {
        port: 3306,
        host: 'localhost',
        user: 'root',
        password: 'joao08',
        database: 'BookSwap',
    }
})