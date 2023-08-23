let auth = require("../validations/auth")
exports.verifyToken = async (logger, connection, responder) => {
    return async (req, res, next) => {
        let result = { res, data: [], status: "failure", statusCode: 401, message: "Unauthorized" };
        try {
            const token = req.headers.authorization
            let tokenVerifyResult = auth.verify(token,logger);
            logger.info({tokenVerifyResult});
            if(tokenVerifyResult.valid == 0){
                result.message = "invalid token";
                throw error;
            }else if(tokenVerifyResult.valid == 1){
                throw error;
            }
            req.tokenPayload = tokenVerifyResult.payload;
            return next();
        }
        catch (e) {
            result.data = [];
            responder(result);
            return ;
        }
    }
};

exports.setRequiredFields =  (logger, connection, responder) => {
    return  (req, res, next) => {
            const pathParts = req.path.split('/');
            req.basePathValue = pathParts[pathParts.length - 1];
            logger.info(req.basePathValue);
            return next();
    }
};