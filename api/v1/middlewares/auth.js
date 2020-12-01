const Validators = require("../utils/validators");
const AuthControllers = require("../controllers/auth");
const Headers = require("../utils/constants").headers;
const Errors = require("../utils/constants").errors;

/* register fields validation middleware
    (using register fields validation to login and
    resending the verification token also
    as the body is same for all)
*/
module.exports.validateRegisterFields = (req, res, next) => {
  const { error } = Validators.registerValidation(req.body);
  if (error) return sendError(error.details[0].message, error, res);
  const passwordError = passwordHasError(req.body.password);
  if (!passwordError) {
    next();
  } else {
    sendError(passwordError, "", res);
  }
};

function sendError(message, error, res) {
  return res.status(400).json({
    status: Errors.FAILED,
    message: message,
    error: error,
  });
}

/* login fields validation middleware
    (using register fields validation to login and
    resending the verification token also
    as the body is same for all)
*/
module.exports.validateLoginFields = (req, res, next) => {
  const { error } = Validators.loginValidation(req.body);
  if (error) return sendError(error.details[0].message, error, res);
  const passwordError = passwordHasError(req.body.password);
  if (!passwordError) {
    next();
  } else {
    sendError(passwordError, "", res);
  }
};

/* 
  password validation middleware
*/
module.exports.validPassword = (req, res, next) => {
  //compare both password field value
  const pwd = req.body.password;

  const hasError = passwordHasError(pwd);
  if (!hasError) {
    next();
  } else {
    return sendError(Errors.INVALID_PASSWORD, hasError, res);
  }
};

/* 
  passwords validation middleware(in case of update password)
*/
module.exports.validPasswords = (req, res, next) => {
  const pwd1 = req.body.oldPassword;
  const pwd2 = req.body.newPassword;

  const hasErrorInPwd1 = passwordHasError(pwd1);
  if (!hasErrorInPwd1) {
    const hasErrorInPwd2 = passwordHasError(pwd2);
    if (!hasErrorInPwd2) {
      // has no errors
      next();
    } else {
      return sendError(Errors.INVALID_PASSWORD, hasErrorInPwd2, res);
    }
  } else {
    return sendError(Errors.INVALID_PASSWORD, hasErrorInPwd1, res);
  }
};

/* 
  email validation middleware
*/
module.exports.validEmail = (req, res, next) => {
  const { error } = Validators.emailValidation(req.body);
  if (error) {
    return sendError(error.details[0].message, error, res);
  }
  next();
};

/* 
  validation of otp and new password middleware
*/
module.exports.validResetFields = (req, res, next) => {
  const { error } = Validators.resetPasswordValidation(req.body);
  if (error) {
    return sendError(error.details[0].message, error, res);
  }
  next();
};

/*
 these methods will just check the availability of tokens,
 they won't verify if they are valid or expired
*/
module.exports.checkRefreshToken = (req, res, next) => {
  if (!req.header(Headers.AUTHORIZATION_HEADER))
    return sendError(Errors.INVALID_TOKEN, Errors.INVALID_TOKEN, res);

  const authHeader = req
    .header(Headers.AUTHORIZATION_HEADER)
    .toString()
    .split(" ");
  if (authHeader != null && authHeader[0] === Headers.BASIC) {
    if (authHeader[1]) {
      req.refreshToken = authHeader[1];
      next();
    } else
      return sendError(Errors.INVALID_TOKEN, Errors.SPECIFY_VALID_TOKEN, res);
  } else
    return res.status(403).json({
      status: Errors.FAILED,
      message: Errors.INVALID_AUTH_TYPE,
    });
};

/*
 these methods will just check the availability of tokens,
 they won't verify if they are valid or expired
*/
module.exports.checkAccessToken = (req, res, next) => {
  if (!req.header(Headers.AUTHORIZATION_HEADER))
    return sendError(Errors.UNAUTHORIZED, Errors.SPECIFY_VALID_HEADER, res);

  const authHeader = req
    .header(Headers.AUTHORIZATION_HEADER)
    .toString()
    .split(" ");
  if (authHeader != null && authHeader[0] === Headers.BEARER) {
    if (authHeader[1]) {
      req.accessToken = authHeader[1];
      next();
    } else
      return sendError(Errors.INVALID_TOKEN, Errors.SPECIFY_VALID_TOKEN, res);
  } else
    return res.status(403).json({
      status: Errors.FAILED,
      message: Errors.INVALID_AUTH_TYPE,
    });
};

/* 
  refreshToken validation middleware
   - handles expiry of refresh token, in this case the user has to re-login to the application
   - if the refresh token is not valid, then Bad request status code is sent back
*/
module.exports.validateRefreshToken = (req, res, next) => {
  const verificationResult = AuthControllers.verifyRefreshToken(
    req.refreshToken
  );
  if (verificationResult.valid) {
    req.tokenData = verificationResult.data;
    next();
  } else if (verificationResult.error.toString().includes(Headers.EXPIRED)) {
    return res.status(401).json({
      status: Errors.FAILED,
      message: Errors.SESSION_EXPIRED,
    });
  } else {
    return res.status(400).json({
      status: Errors.FAILED,
      message: Errors.INVALID_TOKEN,
    });
  }
};

/* 
  accessToken validation middleware
   - handles expiry of access token, in this case the user has to get a new access token
   - if the access token is not valid, then Bad request status code is sent back
*/
module.exports.validateAccessToken = (req, res, next) => {
  const verificationResult = AuthControllers.verifyAccessToken(req.accessToken);
  if (verificationResult.valid) {
    req.tokenData = verificationResult.data;
    next();
  } else if (verificationResult.error.toString().includes(Headers.EXPIRED)) {
    return res.status(401).json({
      status: Errors.FAILED,
      message: Errors.ACCESS_TOKEN_EXPIRED,
    });
  } else {
    return res.status(400).json({
      status: Errors.FAILED,
      message: Errors.INVALID_TOKEN,
    });
  }
};

/*
  Check if user's access has been revoked by the admin
*/
module.exports.checkUserAccess = async (req, res, next) => {
  var authUser = await AuthControllers.getAuthUserWithProjection(
    req.tokenData.authId,
    {
      _id: 1,
      disabled: 1,
    }
  );
  if (!authUser) return sendError(Errors.INVALID_TOKEN, "", res);

  if (authUser.disabled)
    return res.status(403).json({
      status: Errors.FAILED,
      message: Errors.ACC_DISABLED,
    });
  req.authUser = authUser;
  next();
};

/*
  Check if user's access has been revoked by the admin/account is verified
*/
module.exports.checkAdminAccess = async (req, res, next) => {
  var authUser = await AuthControllers.getAuthUserWithProjection(
    req.tokenData.authId,
    {
      _id: 1,
      admin: 1,
      adminVerified: 1,
      disabled: 1,
    }
  );
  if (!authUser || !authUser.admin)
    return res.status(403).json({
      status: Errors.FAILED,
      message: Errors.OPERATION_NOT_PERMITTED,
    });

  if (!authUser.adminVerified)
    return res.status(403).json({
      status: Errors.FAILED,
      message: Errors.ACC_VERIFICATION_PENDING_BY_TEAM,
    });

  if (authUser.disabled)
    return res.status(403).json({
      status: Errors.FAILED,
      message: Errors.ACC_DISABLED,
    });

  req.authUser = authUser;
  next();
};

/*
  Check if oauth access token is valid
*/
module.exports.checkOAuthAccessToken = async (req, res, next) => {
  if (!req.body.accessToken || req.body.accessToken.toString().length < 64)
    return sendError(Errors.INVALID_TOKEN, "", res);
  next();
};

/*
  password check
*/
function passwordHasError(pwd) {
  // at least one numeric value
  var re = /[0-9]/;
  if (!re.test(pwd)) {
    return Errors.PASSWORD_DOES_NOT_CONTAIN_NUMBER;
  }

  // at least one lowercase letter
  re = /[a-z]/;
  if (!re.test(pwd)) {
    return Errors.PASSWORD_DOES_NOT_CONTAIN_LOWERCASE;
  }

  // at least one uppercase letter
  re = /[A-Z]/;
  if (!re.test(pwd)) {
    return Errors.PASSWORD_DOES_NOT_CONTAIN_UPPERCASE;
  }

  // at least one special character
  re = /[`!@#%$&^*()]+/;
  if (!re.test(pwd)) {
    return Errors.PASSWORD_DOES_NOT_CONTAIN_SPECIAL_CHAR;
  }
  return false;
}

/*
  username check
*/
module.exports.checkUsername = async (req, res, next) => {
  const re = /^[a-z][a-z0-9_]{3,10}/;
  if (!re.test(req.params.username))
    return sendError(
      Errors.INVALID_USERNAME,
      "Username should contain at least 1 lowercase, 1 uppercase, 1 special character and 1 number",
      res
    );
  next();
};

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
