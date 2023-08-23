exports.verifySchema = async (logger, responder) => {
    return async (req, res, next) => {
        let result = { res, data: [], status: "", statusCode: 500, message: "something went wrong" };
        try {

            const schema = require(`../schema/${req.basePathValue}`);
            const isRequestValid = await schema.validate(req.body);
            if (isRequestValid.error) {
                logger.error(isRequestValid);
                result.message = isRequestValid.error
                responder(result)
                return;
            }
            logger.info({isRequestValid,body: req.body});
            return  next();;
        }
        catch (e) {
            logger.info({e});
            result.data = [];
            responder(result);
            return ;
        }
    }
};