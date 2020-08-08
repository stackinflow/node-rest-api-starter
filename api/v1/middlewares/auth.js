const { registerValidation, loginValidation } = require("../utils/validators");

// register fields validation middleware
module.exports.validateRegisterFields = (req, res, next) => {
  const { error } = registerValidation(req.body);
  if (error) {
    return res.status(400).json({
      status: "failed",
      message: error.details[0].message,
      error: error,
    });
  }
  next();
};

module.exports.validateLoginFields = (req, res, next) => {
  const { error } = loginValidation(req.body);
  if (error) {
    return res.status(400).json({
      status: "failed",
      message: error.details[0].message,
      error: error,
    });
  }
  next();
};

module.exports.validPassword = (req, res, next) => {
  //compare both password field value
  const pwd = req.body.password;

  // at least one numeric value
  var re = /[0-9]/;
  if (!re.test(pwd)) {
    return res.status(400).json({
      status: "failed",
      message: "Invalid password",
      error: "password must contain at least one number",
    });
  }

  // at least one lowercase letter
  re = /[a-z]/;
  if (!re.test(pwd)) {
    return res.status(400).json({
      status: "failed",
      message: "Invalid password",
      error: "password must contain at least one lowercase letter",
    });
  }

  // at least one uppercase letter
  re = /[A-Z]/;
  if (!re.test(pwd)) {
    return res.status(400).json({
      status: "failed",
      message: "Invalid password",
      error: "password must contain at least one uppercase letter",
    });
  }

  // at least one special character
  re = /[`!@#%$&^*()]+/;
  if (!re.test(pwd)) {
    return res.status(400).json({
      status: "failed",
      message: "Invalid password",
      error: "password must contain at least one special character",
    });
  }
  next();
};
