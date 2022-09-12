const knex = require('knex')

const db = knex.default({
    client: "mysql2",
    connection: {
        user: 'dreamnaphat',
        password: '123456',
        host: '127.0.0.1',
        database: 'nodejs_novel_db',
        port: 3306
    }
})

module.exports = db;