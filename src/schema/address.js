const Joi = require('joi');

const schema = Joi.object({
    type: Joi.string().valid('insert', 'update', 'view').required(),
    address_id: Joi.when('type', {
        is: Joi.valid('update'),
        then: Joi.number().integer().required(),
        otherwise: Joi.number().integer().optional()
    }),
    address_type: Joi.when('type', {
        is: 'view',
        then: Joi.forbidden(),
        otherwise: Joi.string().required()
    }),
    street_address: Joi.when('type', {
        is: 'view',
        then: Joi.forbidden(),
        otherwise: Joi.string().required()
    }),
    city: Joi.when('type', {
        is: 'view',
        then: Joi.forbidden(),
        otherwise: Joi.string().required()
    }),
    state: Joi.when('type', {
        is: 'view',
        then: Joi.forbidden(),
        otherwise: Joi.string().required()
    }),
    pincode: Joi.when('type', {
        is: 'view',
        then: Joi.forbidden(),
        otherwise: Joi.string().required()
    }),
    is_default: Joi.when('type', {
        is: 'view',
        then: Joi.forbidden(),
        otherwise: Joi.boolean().default(false)
    })
});

module.exports = schema;
