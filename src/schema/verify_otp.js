const Joi = require("joi");
const schema = Joi.object().keys({
    "mobile":Joi.number().required(),
    "otp":Joi.number().required()
});
module.exports = schema;