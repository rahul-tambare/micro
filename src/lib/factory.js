exports.createServer = function (serverTypeName, port) {
    var server = require('../servers/' + serverTypeName + '.js')
    server.start(port);
}
