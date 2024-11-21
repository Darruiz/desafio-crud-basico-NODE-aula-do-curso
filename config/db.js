const mysql = require('mysql2');

class Database {
    static instance;

    constructor(config) {
        if (Database.instance) {
            return Database.instance; // Retorna a mesma instância se já existir
        }

        this.connection = mysql.createPool({
            ...config,
            waitForConnections: true,
            connectionLimit: 10, // Configurações para alta escalabilidade
            queueLimit: 0
        });

        Database.instance = this;
    }

    /**
     * Método para executar consultas no banco de dados.
     * @param {string} query - A query SQL.
     * @param {Array} params - Os parâmetros da query.
     * @returns {Promise} - Retorna os resultados ou um erro.
     */
    execute(query, params = []) {
        return new Promise((resolve, reject) => {
            this.connection.query(query, params, (err, results) => {
                if (err) {
                    console.error('Erro na query:', err.message);
                    return reject(err);
                }
                resolve(results);
            });
        });
    }

    /**
     * Fecha todas as conexões do pool (se necessário em encerramentos de app).
     */
    close() {
        return new Promise((resolve, reject) => {
            this.connection.end(err => {
                if (err) {
                    console.error('Erro ao encerrar conexão:', err.message);
                    return reject(err);
                }
                resolve();
            });
        });
    }
}

module.exports = new Database({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'task_manager'
});