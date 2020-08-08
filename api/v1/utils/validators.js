/// validation
const Joi = require("@hapi/joi");

const registerValidation = (data) => {
  const schema = Joi.object({
    email: Joi.string().min(3).max(256).required().email(),
    password: Joi.string().min(6).required(),
  });

  return schema.validate(data);
};

const loginValidation = (data) => {
  const schema = Joi.object({
    email: Joi.string().min(6).max(1024).required().email(),
    password: Joi.string().min(6).required(),
  });

  return schema.validate(data);
};

module.exports.registerValidation = registerValidation;
module.exports.loginValidation = loginValidation;
