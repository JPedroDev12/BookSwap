import knex from "knex";

const db = knex({
    client: 'mysql',
    connection: {
        port: 3306,
        host: 'localhost',
        user: 'root',
        password: 'joao08',
        database: 'BookSwap',
    }
})