const {
  registerValidation,
  emailValidation,
  resetPasswordValidation,
} = require("../utils/validators");
const {
  verifyRefreshToken,
  verifyAccessToken,
  getAuthUserWithProjection,
} = require("../controllers/auth");
const {
  EXPIRED,
  AUTHORIZATION_HEADER,
  BASIC,
  BEARER,
} = require("../utils/constants");

// register fields validation middleware
// using register fields validation to login and
// resending the verification token also
// as the body is same for all
module.exports.validateRegisterFields = (req, res, next) => {
  const { error } = registerValidation(req.body);
  if (error)
    return res.status(400).json({
      status: "failed",
      message: error.details[0].message,
      error: error,
    });

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

module.exports.validateRefreshToken = (req, res, next) => {
  const verificationResult = verifyRefreshToken(req.refreshToken);
  if (verificationResult.valid) {
    req.tokenData = verificationResult.data;
    next();
  } else if (verificationResult.error.toString().includes(EXPIRED)) {
    return res.status(511).json({
      status: "failed",
      message: "User session expired, login again",
    });
  } else {
    return res.status(401).json({
      status: "failed",
      message: "Invalid token",
    });
  }
};

module.exports.validateAccessToken = (req, res, next) => {
  const verificationResult = verifyAccessToken(req.accessToken);
  if (verificationResult.valid) {
    req.tokenData = verificationResult.data;
    next();
  } else if (verificationResult.error.toString().includes(EXPIRED)) {
    return res.status(511).json({
      status: "failed",
      message: "User session expired, login again",
    });
  } else {
    return res.status(401).json({
      status: "failed",
      message: "Invalid token",
    });
  }
};

// these methods will just check the availability of tokens,
// they won't verify if they are valid or expired
module.exports.checkRefreshToken = (req, res, next) => {
  if (!req.header(AUTHORIZATION_HEADER))
    return res.status(400).json({
      status: "failed",
      message: "No token specified",
    });

  const authHeader = req.header(AUTHORIZATION_HEADER).toString().split(" ");
  if (authHeader != null && authHeader[0] === BASIC) {
    if (authHeader[1]) {
      req.refreshToken = authHeader[1];
      next();
    } else
      return res.status(400).json({
        status: "failed",
        message: "Invalid/malformed token",
      });
  } else
    return res.status(403).json({
      status: "failed",
      message: "Unsupported type of authentication",
    });
};

module.exports.checkAccessToken = (req, res, next) => {
  if (!req.header(AUTHORIZATION_HEADER))
    return res.status(400).json({
      status: "failed",
      message: "No token specified",
    });

  const authHeader = req.header(AUTHORIZATION_HEADER).toString().split(" ");
  if (authHeader != null && authHeader[0] === BEARER) {
    if (authHeader[1]) {
      req.accessToken = authHeader[1];
      next();
    } else
      return res.status(400).json({
        status: "failed",
        message: "Invalid/malformed token",
      });
  } else
    return res.status(403).json({
      status: "failed",
      message: "Unsupported type of authentication",
    });
};

module.exports.checkUser = async (req, res, next) => {
  var authUser = await getAuthUserWithProjection(req.tokenData.email, {
    _id: 1,
    disabled: 1,
  });
  if (!authUser)
    return res.status(400).json({
      status: "failed",
      message: "Invalid user/token",
    });

  if (authUser.disabled)
    return res.status(403).json({
      status: "failed",
      message:
        "Your account has been disabled access, please contact support for more information",
    });
  req.authUser = authUser;
  next();
};

module.exports.checkAdmin = async (req, res, next) => {
  var authUser = await getAuthUserWithProjection(req.tokenData.email, {
    _id: 1,
    admin: 1,
    adminVerified: 1,
    disabled: 1,
  });
  if (!authUser || !authUser.admin)
    return res.status(403).json({
      status: "failed",
      message: "You are not permitted to perform this operation",
    });

  if (!authUser.adminVerified)
    return res.status(403).json({
      status: "failed",
      message:
        "Your account is not verified by our team, please contact support for more information",
    });

  if (authUser.disabled)
    return res.status(403).json({
      status: "failed",
      message:
        "Your account has been disabled access, please contact support for more information",
    });

  req.authUser = authUser;
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

/*
module.exports.checkAuthHeader = (req, res, next) => {
  const authHeader = req.header(AUTHORIZATION_HEADER).toString().split(" ");
  if (
    authHeader != null &&
    authHeader[0] === BASIC &&
    req.header(GRANT_TYPE) === CREDENTIALS
  ) {
    const credentials = Buffer.from(authHeader[1], BASE64)
      .toString()
      .split(":");

    req.credentials = { email: credentials[0], password: credentials[1] };
    next();
  } else
    return res.status(403).json({
      status: "failed",
      message: "Unsupported type of authentication",
    });
};
*/
