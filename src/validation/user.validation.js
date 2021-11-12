const Joi = require('joi')

const registerSchema = Joi.object({
    email: Joi.string().required().max(255).email(),
    password: Joi.string().required().min(8).max(1024),
})

const loginSchema = Joi.object({
    email: Joi.string().required().max(255).email(),
    password: Joi.string().required().max(1024),
})

let registerValidation = (body) => {
    return registerSchema.validate(body)
}

let loginValidation = (body) => {
    return loginSchema.validate(body)
}

module.exports = { registerValidation, loginValidation }
