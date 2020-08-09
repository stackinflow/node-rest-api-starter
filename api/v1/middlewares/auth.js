const {
  registerValidation,
  emailValidation,
  resetPasswordValidation,
} = require("../utils/validators");

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

module.exports.validPassword = (req, res, next) => {
  //compare both password field value
  const pwd = req.body.password;

  const valid = checkPassword(pwd);
  if (valid === true) next();
  else
    return res.status(400).json({
      status: "failed",
      message: "Invalid password",
      error: valid,
    });
};

module.exports.validPasswords = (req, res, next) => {
  const pwd1 = req.body.oldPassword;
  const pwd2 = req.body.newPassword;

  const valid = checkPassword(pwd1);
  if (valid === true) {
    const valid2 = checkPassword(pwd2);
    if (valid2 === true) next();
    else
      return res.status(400).json({
        status: "failed",
        message: "Invalid password",
        error: valid,
      });
  } else
    return res.status(400).json({
      status: "failed",
      message: "Invalid password",
      error: valid,
    });
};

module.exports.validEmail = (req, res, next) => {
  const { error } = emailValidation(req.body);
  if (error) {
    return res.status(400).json({
      status: "failed",
      message: error.details[0].message,
      error: error,
    });
  }
  next();
};

module.exports.validResetFields = (req, res, next) => {
  const { error } = resetPasswordValidation(req.body);
  if (error) {
    return res.status(400).json({
      status: "failed",
      message: error.details[0].message,
      error: error,
    });
  }
  next();
};

function checkPassword(pwd) {
  // at least one numeric value
  var re = /[0-9]/;
  if (!re.test(pwd)) {
    return "password must contain at least one number";
  }

  // at least one lowercase letter
  re = /[a-z]/;
  if (!re.test(pwd)) {
    return "password must contain at least one lowercase letter";
  }

  // at least one uppercase letter
  re = /[A-Z]/;
  if (!re.test(pwd)) {
    return "password must contain at least one uppercase letter";
  }

  // at least one special character
  re = /[`!@#%$&^*()]+/;
  if (!re.test(pwd)) {
    return "password must contain at least one special character";
  }
  return true;
}
