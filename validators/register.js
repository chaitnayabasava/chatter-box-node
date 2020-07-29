const Joi = require('joi');

const schema = Joi.object({
    username: Joi.string()
            .required(),
    
    email: Joi.string()
            .email()
            .required(),
    
    password: Joi.string()
            .min(8)
            .required(),
    
    confirm_password: Joi.string()
            .valid(Joi.ref('password'))
            .required()
})

module.exports = schema