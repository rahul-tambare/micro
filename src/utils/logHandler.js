const logOptionsConfig = require('../../config/develop/servicePortConfig.json').logOptions;
// const auth = require('../modules/auth');
const winston = require('winston')
require('winston-daily-rotate-file');
const path = require('path');
const util = require('util');
var apiLoggerInstance;

const logRequest = (req, logger) => {
    let reqHeaders = JSON.stringify(req.headers);
    let reqPath = req.path;
    let reqMethod = req.method;
    let reqBody = req.body ? JSON.stringify(req.body) : " ";
    let reqQuery = req.query ? JSON.stringify(req.query) : " ";
    logger.info(`LOG REQUEST BODY: ${reqBody}`);
    logger.info(`
    -----------------------------------------------------------------
    REQUEST PATH: ${reqPath}
    -----------------------------------------------------------------
    REQUEST HEADER: ${reqHeaders}
    -----------------------------------------------------------------
    REQUEST METHOD: ${reqMethod}
    -----------------------------------------------------------------`);
    logger.debug(`
    -----------------------------------------------------------------
    REQUEST BODY: ${reqBody}
    -----------------------------------------------------------------
    REQUEST QUERY: ${reqQuery}
    -----------------------------------------------------------------`
    );
}

const logResponse = (res, logger) => {
    let resStatus = res.statusCode;
    let resMessage = res.statusMessage;
    let resTime = res.getHeaders()['x-response-time'];
    let resBody = res.responseBody;
    logger.debug(resStatus >= 200 && resStatus < 300 ? 'info' : 'error', 
    `-----------------------------------------------------------------
    RESPONSE STATUS: ${resStatus}
    -----------------------------------------------------------------
    RESPONSE MESSAGE: ${resMessage}
    -----------------------------------------------------------------
    RESPONSE TIME: ${resTime}
    -----------------------------------------------------------------`);
    if(resBody && resBody.length < 1000) {
        logger.debug(`
        -----------------------------------------------------------------
        RESPONSE BODY: ${resBody}
        -----------------------------------------------------------------`
        );
    } else {
        logger.debug(`
        -----------------------------------------------------------------
        Response contains more than 1000 characters
        -----------------------------------------------------------------
        RESPONSE BODY LENGTH: ${resBody ? resBody.length : 0}
        -----------------------------------------------------------------`
        );
    }
}

module.exports = function (logger, errorHandling) {
    return function (req, res, next) {
        try {
            let path = req.path.split('/').filter(r => r);
            let microserviceName = path.shift();
            microserviceName = `Microservice:${microserviceName}`;
            let endpointName = path.join('/');
            endpointName = `Endpoint:${endpointName}`;
            // need
            let jwt //auth.decode(req.headers['authorization']);
            let tokenPayload = jwt ? jwt.payload : {};
            let appId = { MessUser: '1', Partner: '2' }[tokenPayload.role];
            appId = appId ? appId : "NA";
            appId = `AppID:${appId}`;
            let userId = tokenPayload.userId ? tokenPayload.userId : "NA";
            userId = `UserId:${userId}`;
            let userType = tokenPayload.role ? tokenPayload.role : "NA";
            userType = `UserType:${userType}`;
            let traceId = req.headers['x-amzn-trace-id'] ?
                req.headers['x-amzn-trace-id'] : "NA";
            traceId = `TraceId:${traceId}`;

            let workerID = `WorkerID:${process.pid}`;
            let platformId = tokenPayload.platformId ? tokenPayload.platformId : "NA";
            platformId = `PlatformId:${platformId}`;
            logger.defaultMeta.label = ` ${workerID}    ${traceId}   ${microserviceName}   ${endpointName}   ${appId}   ${userId}   ${userType}   ${platformId}`;

            logRequest(req, logger);
            const resSend = res.send.bind(res);
            res.send = function (body) {
                res.responseBody = body && typeof body === "string" ? body + "" : " "
                resSend(body);
            }
            res.on('finish', function () {
                logResponse(res, logger);
            });
            next();
        } catch (err) {
            logger.error(err.stack);
            errorHandling.errorHandler(500, err, res, logger);
        }
    }
}

module.exports.logger = function (level, logOptions = logOptionsConfig) {
    let fileNamePattern = logOptions.fileNamePattern.replace("<DATE>", "%DATE%");
    let isApiLogger = logOptions.fileNamePattern == logOptionsConfig.fileNamePattern;
    let transports = [
        new winston.transports.DailyRotateFile({
            level: level || logOptions.logLevel || "info",
            filename: path.join(logOptions.logDirectory, fileNamePattern),
            datePattern: logOptions.dateFormat,
            // zippedArchive: true,
            maxSize: logOptions.maxSize,
            maxFiles: logOptions.maxFiles,
        })
    ];

    if (isApiLogger) {
        transports.push(
            new winston.transports.DailyRotateFile({
                level: "error",
                filename: path.join(logOptions.logDirectory, logOptions.errorFileNamePattern.replace("<DATE>", "%DATE%")),
                datePattern: logOptions.dateFormat,
                // zippedArchive: true,
                maxSize: logOptions.maxSize,
                maxFiles: logOptions.maxFiles,
            }));
    }

    const combineMessageAndSplat = () => {
        return {
            transform: (info, opts) => {
                //combine message and args if any
                if (info.level == "error" && !!!info[Symbol.for('splat')] && info.stack)
                    info.message = util.format(info.stack)
                else
                    info.message = util.format(info.message, ...info[Symbol.for('splat')] || [])
                return info;
            }
        }
    }

    var logger = winston.createLogger({
        defaultMeta: {},
        format: winston.format.combine(
            winston.format.timestamp({ format: 'HH:mm:ss.SSS' }),
            combineMessageAndSplat(),
            winston.format.simple(),
            winston.format.printf(({ level, message, label, timestamp }) => `${timestamp} ${label || ''} ${level.toUpperCase()} ${message}`),
        ),
        transports
    });

    if (isApiLogger) {
        if (apiLoggerInstance !== undefined) {
            logger = apiLoggerInstance;
        }
        else {
            apiLoggerInstance = logger;
        }
    }

    return logger;
}