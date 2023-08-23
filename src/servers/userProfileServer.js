const express = require("express");
var app = express(),
    helmet = require("helmet"),
    cors = require("cors");
const logger = require("../utils/logHandler").logger();
const responder = require("../utils/handlers").response;
const userProfileServlets = require("../servlets/userProfileServlets");
const authServlets = require("../servlets/authServelets");
const validateServlets = require("../servlets/validateServlets")
//let  physical = require("express-physical"); 

const start = async (port,pool) => {
    // uncomment this below line to enable cors on local for admin panel
    // repeat the same in other service.js files in src/servers folder
    // you can use find and replace too
    // app.use(cors());
    logger.info("details:");
    app.use(helmet());
    logger.info("details:");
    app.use(express.json());
    app.post(
        "/user_profile/generate_otp",
        await authServlets.setRequiredFields(logger, pool, responder),
        await validateServlets.verifySchema(logger,responder),
        await userProfileServlets.post(logger, pool, responder)
    );
    app.post(
        "/user_profile/verify_otp",
        // await authServlets.verifyToken(logger, pool, responder),
        await authServlets.setRequiredFields(logger, pool, responder),
        await validateServlets.verifySchema(logger,responder),
        await userProfileServlets.post(logger, pool, responder)
    );
    app.post(
        "/user_profile/verify_otp1",
        await authServlets.verifyToken(logger, pool, responder),
        await authServlets.setRequiredFields(logger, pool, responder),
        await validateServlets.verifySchema(logger,responder),
        await userProfileServlets.post(logger, pool, responder)
    );
    app.listen(port);
}

module.exports.start = start;