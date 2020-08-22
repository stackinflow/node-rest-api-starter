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
} = require("../utils/constants").headers;
const {
  FAILED,
  INVALID_PASSWORD,
  INVALID_TOKEN,
  INVALID_AUTH_TYPE,
  SESSION_EXPIRED,
  ACCESS_TOKEN_EXPIRED,
  ACC_DISABLED,
  OPERATION_NOT_PERMITTED,
  ACC_VERIFICATION_PENDING_BY_TEAM,
  PASSWORD_DOES_NOT_CONTAIN_NUMBER,
  PASSWORD_DOES_NOT_CONTAIN_LOWERCASE,
  PASSWORD_DOES_NOT_CONTAIN_UPPERCASE,
  PASSWORD_DOES_NOT_CONTAIN_SPECIAL_CHAR,
} = require("../utils/constants").errors;

/* register fields validation middleware
    (using register fields validation to login and
    resending the verification token also
    as the body is same for all)
*/
module.exports.validateRegisterFields = (req, res, next) => {
  const { error } = registerValidation(req.body);
  if (error)
    return res.status(400).json({
      status: FAILED,
      message: error.details[0].message,
      error: error,
    });

  next();
};

/* 
  password validation middleware
*/
module.exports.validPassword = (req, res, next) => {
  //compare both password field value
  const pwd = req.body.password;

  const valid = checkPassword(pwd);
  if (valid === true) next();
  else
    return res.status(400).json({
      status: FAILED,
      message: INVALID_PASSWORD,
      error: valid,
    });
};

/* 
  passwords validation middleware(in case of update password)
*/
module.exports.validPasswords = (req, res, next) => {
  const pwd1 = req.body.oldPassword;
  const pwd2 = req.body.newPassword;

  const valid = checkPassword(pwd1);
  if (valid === true) {
    const valid2 = checkPassword(pwd2);
    if (valid2 === true) next();
    else
      return res.status(400).json({
        status: FAILED,
        message: INVALID_PASSWORD,
        error: valid,
      });
  } else
    return res.status(400).json({
      status: FAILED,
      message: INVALID_PASSWORD,
      error: valid,
    });
};

/* 
  email validation middleware
*/
module.exports.validEmail = (req, res, next) => {
  const { error } = emailValidation(req.body);
  if (error) {
    return res.status(400).json({
      status: FAILED,
      message: error.details[0].message,
      error: error,
    });
  }
  next();
};

/* 
  validation of otp and new password middleware
*/
module.exports.validResetFields = (req, res, next) => {
  const { error } = resetPasswordValidation(req.body);
  if (error) {
    return res.status(400).json({
      status: FAILED,
      message: error.details[0].message,
      error: error,
    });
  }
  next();
};

/*
 these methods will just check the availability of tokens,
 they won't verify if they are valid or expired
*/
module.exports.checkRefreshToken = (req, res, next) => {
  if (!req.header(AUTHORIZATION_HEADER))
    return res.status(400).json({
      status: FAILED,
      message: INVALID_TOKEN,
    });

  const authHeader = req.header(AUTHORIZATION_HEADER).toString().split(" ");
  if (authHeader != null && authHeader[0] === BASIC) {
    if (authHeader[1]) {
      req.refreshToken = authHeader[1];
      next();
    } else
      return res.status(400).json({
        status: FAILED,
        message: INVALID_TOKEN,
      });
  } else
    return res.status(403).json({
      status: FAILED,
      message: INVALID_AUTH_TYPE,
    });
};

/*
 these methods will just check the availability of tokens,
 they won't verify if they are valid or expired
*/
module.exports.checkAccessToken = (req, res, next) => {
  if (!req.header(AUTHORIZATION_HEADER))
    return res.status(400).json({
      status: FAILED,
      message: INVALID_TOKEN,
    });

  const authHeader = req.header(AUTHORIZATION_HEADER).toString().split(" ");
  if (authHeader != null && authHeader[0] === BEARER) {
    if (authHeader[1]) {
      req.accessToken = authHeader[1];
      next();
    } else
      return res.status(400).json({
        status: FAILED,
        message: INVALID_TOKEN,
      });
  } else
    return res.status(403).json({
      status: FAILED,
      message: INVALID_AUTH_TYPE,
    });
};

/* 
  refreshToken validation middleware
   - handles expiry of refresh token, in this case the user has to re-login to the application
   - if the refresh token is not valid, then Bad request status code is sent back
*/
module.exports.validateRefreshToken = (req, res, next) => {
  const verificationResult = verifyRefreshToken(req.refreshToken);
  if (verificationResult.valid) {
    req.tokenData = verificationResult.data;
    next();
  } else if (verificationResult.error.toString().includes(EXPIRED)) {
    return res.status(401).json({
      status: FAILED,
      message: SESSION_EXPIRED,
    });
  } else {
    return res.status(400).json({
      status: FAILED,
      message: INVALID_TOKEN,
    });
  }
};

/* 
  accessToken validation middleware
   - handles expiry of access token, in this case the user has to get a new access token
   - if the access token is not valid, then Bad request status code is sent back
*/
module.exports.validateAccessToken = (req, res, next) => {
  const verificationResult = verifyAccessToken(req.accessToken);
  if (verificationResult.valid) {
    req.tokenData = verificationResult.data;
    next();
  } else if (verificationResult.error.toString().includes(EXPIRED)) {
    return res.status(401).json({
      status: FAILED,
      message: ACCESS_TOKEN_EXPIRED,
    });
  } else {
    return res.status(400).json({
      status: FAILED,
      message: INVALID_TOKEN,
    });
  }
};

/*
  Check if user's access has been revoked by the admin
*/
module.exports.checkUserAccess = async (req, res, next) => {
  var authUser = await getAuthUserWithProjection(req.tokenData.email, {
    _id: 1,
    disabled: 1,
  });
  if (!authUser)
    return res.status(400).json({
      status: FAILED,
      message: INVALID_TOKEN,
    });

  if (authUser.disabled)
    return res.status(403).json({
      status: FAILED,
      message: ACC_DISABLED,
    });
  req.authUser = authUser;
  next();
};

/*
  Check if user's access has been revoked by the admin/account is verified
*/
module.exports.checkAdminAccess = async (req, res, next) => {
  var authUser = await getAuthUserWithProjection(req.tokenData.email, {
    _id: 1,
    admin: 1,
    adminVerified: 1,
    disabled: 1,
  });
  if (!authUser || !authUser.admin)
    return res.status(403).json({
      status: FAILED,
      message: OPERATION_NOT_PERMITTED,
    });

  if (!authUser.adminVerified)
    return res.status(403).json({
      status: FAILED,
      message: ACC_VERIFICATION_PENDING_BY_TEAM,
    });

  if (authUser.disabled)
    return res.status(403).json({
      status: FAILED,
      message: ACC_DISABLED,
    });

  req.authUser = authUser;
  next();
};

/*
  Check if oauth access token is valid
*/
module.exports.checkOAuthAccessToken = async (req, res, next) => {
  if (!req.body.accessToken || req.body.accessToken.toString().length < 64)
    return res.status(400).json({
      status: FAILED,
      message: INVALID_TOKEN,
    });
  next();
};

/*
  password check
*/
function checkPassword(pwd) {
  // at least one numeric value
  var re = /[0-9]/;
  if (!re.test(pwd)) {
    return PASSWORD_DOES_NOT_CONTAIN_NUMBER;
  }

  // at least one lowercase letter
  re = /[a-z]/;
  if (!re.test(pwd)) {
    return PASSWORD_DOES_NOT_CONTAIN_LOWERCASE;
  }

  // at least one uppercase letter
  re = /[A-Z]/;
  if (!re.test(pwd)) {
    return PASSWORD_DOES_NOT_CONTAIN_UPPERCASE;
  }

  // at least one special character
  re = /[`!@#%$&^*()]+/;
  if (!re.test(pwd)) {
    return PASSWORD_DOES_NOT_CONTAIN_SPECIAL_CHAR;
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
      status: FAILED,
      message: "Unsupported type of authentication",
    });
};
*/
