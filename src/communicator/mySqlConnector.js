const mysql = require('mysql2');
/*
 This modules connects to mysql database. Gets path of config file.
 Reads this config file converts it to JSON and creates mysql URI string.
 Connects to database and sends the response and error to callback function.
 */
function mySqlConnector() {

    this.connect = function(mySqlConfig, logger, callback) {

        if (typeof callback !== 'function') {
            logger.error("Invalid callback type");
            return "Invalid callback type";
        }

        const connection = mysql.createConnection({
            host: mySqlConfig['url'],
            port: mySqlConfig['port'],
            user: mySqlConfig['user'],
            password: mySqlConfig['pass'],
            database: mySqlConfig['database'],
            maxPreparedStatements: 500,
            multipleStatements: true,
            connectTimeout : mySqlConfig['connectTimeout']
        });

        callback(null, connection);
    };
}

module.exports = mySqlConnector;
