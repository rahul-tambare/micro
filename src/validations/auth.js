let jwt   = require('jsonwebtoken');
let secretKey = require('../../config/develop/servicePortConfig.json').secretKey


exports.generateAccessToken = (payload,logger) => {
    try{
          const options = {
            expiresIn: '30d' // Token will expire in 30 days
          };
          const token = jwt.sign(payload, secretKey, options);
          logger.info('Generated Token:', token);
          return token;

    }catch(e){
        logger.error("token not generated");
        throw e;
    }
}

exports.verify = (token,logger) => {
    try {
        let payload =  jwt.verify(token, secretKey);
        logger.info({verifyAccessTokenPayload:payload});
        const unixTimestamp = new Date().valueOf();
        logger.info(unixTimestamp,payload.exp);
        if(payload?.exp > unixTimestamp){
            return {payload,valid:2};
        }else{
            return {payload,valid:1};
        }
    } catch (error) {
        logger.error("verifyAccessToken",error)
        return {valid:0};
    }
};
