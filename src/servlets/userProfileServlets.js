let resStatus = require("../utils/handlers").resStatus;
let userService = require("../service/userProfileService")
exports.post = async (logger, pool, responder) => {
  return async (req, res, next) => {
    let result = { res, data: [], status: "success", statusCode: 200, message: "data fetched successfully" };
    const connection = await pool.getConnection();
    try {
      let params = req.body;
      let authData = req?.tokenPayload ? req.tokenPayload :  {} ;
      console.log(params);
      result.data = await userService[req.basePathValue](params, logger, connection,authData);
      return;
    } catch (e) {
      logger.info(e);
      console.log("error")
      result.data = [];
      let errorMessageAndCode =  resStatus("E503");
      result.statusCode = errorMessageAndCode.statusCode
      result.message = errorMessageAndCode.message
      return;
    } finally {
      logger.debug({ result })
      responder(result);
      await connection.release();
      return;
    }
  }
};