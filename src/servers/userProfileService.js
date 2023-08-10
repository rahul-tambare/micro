const express =  require("express");
var app = express(), 
helmet = require("helmet"),
cors = require("cors");
const logger = require("../utils/logHandler").logger(); 
const responder = require("../utils/handlers").response;
const userProfileServlets = require("../servlets/userProfileServlets")
//let  physical = require("express-physical"); 
let mysqlHandler = '';
var mySqlWriteInstance;

exports.start = function (port) {
    // uncomment this below line to enable cors on local for admin panel
    // repeat the same in other service.js files in src/servers folder
    // you can use find and replace too
    // app.use(cors());

    //conect mysql,console log,auth
    mySqlConnector = new mySqlConnector();
    utclConnector = new utclConnector();
    mySqlConnector.connect(
      mySqlConfig.MySqlWriteInstance,
      logger,
      function (err, res) {
        if (err !== null) {
          return err;
        }
        mySqlWriteInstance = res;
      }
    );

    app.use(helmet());
    logger.info("details:");
    app.get(
        "/user-profile-service/generate-otp",
        // isAuthenticated.auth(responder, errorHandling, logger, auth),
        userProfileServlets.generateOtp()
    );
    app.get(
        "/user-profile-service/verify-otp",
        // isAuthenticated.auth(responder, errorHandling, logger, auth),
        userProfileServlets.verifyOtp(logger,mysqlHandler,responder)
    );
    app.listen(port); 
}