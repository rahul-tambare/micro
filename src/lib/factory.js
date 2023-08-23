const mySqlConfig = require("../../config/develop/mySqlConfig.json").MySqlWriteInstance
const mysql = require('mysql2/promise');
// Create a connection pool
const pool = mysql.createPool({
    host: mySqlConfig['url'],
    port: mySqlConfig['port'],
    user: mySqlConfig['user'],
    password: mySqlConfig['pass'],
    database: mySqlConfig['database'],
    maxPreparedStatements: 500,
    multipleStatements: true,
    connectTimeout : mySqlConfig['connectTimeout'],
    connectionLimit: 10 // Adjust the number of connections in the pool as needed
});

exports.createServer = function (serverTypeName, port) {
    var server = require('../servers/' + serverTypeName + '.js')
    server.start(port,pool);
}
