//

exports.generateOtp = () => {
    return (req,res,next) => {
        res()
    }
};
exports.verifyOtp = (logger,mysqlHandler,responder) => {
    return (req,res,next) => {
        logger.info("success");
        let data = [{name:"rahul"}]
        responder(res,data,200,"user valideted successfully","success");
        return;
    }
};