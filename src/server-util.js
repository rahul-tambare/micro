var cluster = require('cluster');
var kaConfig = require('../config/develop/servicePortConfig.json');
const logger = require("./utils/logHandler").logger();
exports.startServers = (workerCount, next)=> {

    function setWorkerListeners(worker){
        worker.on('listening', (address) => {
            logger.info(
                "A worker is now connected to port :", 
                address.port,
                "and process id is : ",
                worker.process.pid
            );
            console.log(
                "A worker is now connected to port : ",
                address.port,
                "and process id is : ",
                worker.process.pid);
        });
        
        worker.on('disconnect', () => {
            logger.error('worker ', worker.process.pid, ' died');
            console.log('worker '+ worker.process.pid+ ' died');
        });

        worker.on('exit', (code, signal) => {
            if(code && !signal){
		logger.info('Starting a new worker');
            	console.log('Starting a new worker');
                setWorkerListeners(cluster.fork());
            }
        });
    }

    if (cluster.isMaster) {  
        // Fork workers.
        for (var i = 0; i < workerCount; i++) { 
            logger.info("Starting Server Process ", i+1);
            setWorkerListeners(cluster.fork());
        }
    }else{
        var serverFactory = require('./lib/factory.js');
        serverFactory.createServer(
            'userProfileService',
            kaConfig["servicePortMappings"]["userProfileService"]
        ); 
    }
}    


