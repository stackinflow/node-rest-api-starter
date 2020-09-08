// validation
const Joi = require("@hapi/joi");

const registerValidation = (data) => {
  const schema = Joi.object({
    name: Joi.string().min(3).required(),
    email: Joi.string().min(3).max(256).required().email(),
    password: Joi.string().min(6).required(),
  });

  return schema.validate(data);
};
const loginValidation = (data) => {
  const schema = Joi.object({
    email: Joi.string().min(3).max(256).required().email(),
    password: Joi.string().min(6).required(),
  });

  return schema.validate(data);
};

const emailValidation = (data) => {
  const schema = Joi.object({
    email: Joi.string().min(6).max(256).required().email(),
  });

  return schema.validate(data);
};

const updatePasswordValidation = (data) => {
  const schema = Joi.object({
    email: Joi.string().min(6).max(256).required().email(),
    oldPassword: Joi.string().min(6).required(),
    newPassword: Joi.string().min(6).required(),
  });

  return schema.validate(data);
};

const resetPasswordValidation = (data) => {
  const schema = Joi.object({
    email: Joi.string().min(6).max(256).required().email(),
    password: Joi.string().min(6).required(),
    otp: Joi.number().min(6).required(),
  });

  return schema.validate(data);
};

module.exports.resetPasswordValidation = resetPasswordValidation;
module.exports.updatePasswordValidation = updatePasswordValidation;
module.exports.emailValidation = emailValidation;
module.exports.registerValidation = registerValidation;
module.exports.loginValidation = loginValidation;
