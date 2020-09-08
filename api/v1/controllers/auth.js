const Auth = require("../models/auth");
const bcrypt = require("bcryptjs");
const jwt = require("../../../core/jwt");
const JWTHandler = new jwt();
const {
  sendVerificationMail,
  sendNewVerificationMail,
  verifyUser,
  sendOTPForPasswordReset,
  resendOTPForPasswordReset,
  verifyOTP,
  deleteOldToken,
} = require("./token");
const {
  ACCESS_TOKEN,
  REFRESH_TOKEN,
  FB_OAUTH_URL,
  GOOGLE_OAUTH_URL,
  EMAIL_KEY,
  FACEBOOK_KEY,
  GOOGLE_KEY,
  FB_OAUTH_REFRESH,
  EXPIRE,
} = require("../utils/constants").headers;
const {
  EMAIL_IN_USE,
  FAILED,
  REGISTER_FAILED,
  INVALID_EMAIL_PASSWORD,
  INCORRECT_PASSWORD,
  INVALID_TOKEN,
  INVALID_EXPIRED_VERIFY_TOKEN,
  ACCOUNT_ALREADY_VERIFIED,
  USER_NOT_EXISTS,
  OLD_PASSWORD_IS_SAME,
  PASSWORD_CHANGE_FAILED,
  TRY_LATER,
  INVALID_EXPIRED_OTP,
  TOKEN_REFRESH_FAILED,
  INVALID_MALFORMED_REFRESH_TOKEN,
  ACC_DELETE_FAILED,
  FETCH_USERS_FAILED,
  FETCH_ADMINS_FAILED,
  FACEBOOK_LOGIN_FAILED,
  FACEBOOK_GOOGLE_FAILED,
  USER_ACCESS_ALREADY,
  DISABLED,
  ENABLED,
  ACCESS_ENABLE_FAILED,
  ACCESS_DISABLE_FAILED,
  GOOGLE_REGISTER_FAILED,
  FB_REGISTER_FAILED,
  EMAIL_IN_USE_BY_OTHER_PROVIDER,
  ACCOUNT_NOT_VERIFIED,
  ACC_DISABLED,
  LOGIN_NOT_ALLOWED,
  ACC_UNDER_REVIEW,
  TOKENS_REFRESHED,
  SESSION_EXPIRED,
  OAUTH_LOGIN_FAILED,
  OAUTH_TOKEN_REFRESH_ERROR,
  LOGIN_FAILED,
} = require("../utils/constants").errors;
const {
  SUCCESS,
  VERIFY_MAIL_SENT,
  ACC_VERIFIED,
  RESENT_VERIFY_EMAIL,
  PASSWORD_UPDATED,
  OTP_SENT,
  OTP_RESENT,
  PASSWORD_RESET,
  ACC_DELETED,
  FETCHED_USERS,
  FETCHED_ADMINS,
  ACCESS_ENABLED,
  ACCESS_DISABLED,
  LOGIN_SUCCESS,
} = require("../utils/constants").successMessages;
const {
  createUser,
  deleteUser,
  fetchNameOfUser,
} = require("../controllers/user");
const { default: Axios } = require("axios");
const { joinWithCommaSpace, joinWithSpace } = require("../../../core/helpers");

/* User registration with email   
    - check if email is existing/email being used by another provider
    - if existing then send conflict response
    - if not existing, create a hashed password using [bcrypt]
    - save the user in the database
    - send an account verification email to the respective email
    - [ERROR] if failed to save user in db, send an error response
*/
module.exports.registerWithEmail = async (req, res, registerAsAdmin) => {
  if (registerAsAdmin === null) registerAsAdmin = false;
  // check if user exists
  var authUser = await getAuthUser(req.body.email);

  if (authUser)
    return res.status(409).json({ status: FAILED, message: EMAIL_IN_USE });

  const hashedPassword = await _hashThePassword(req.body.password);

  // create user form data
  const newAuthUser = new Auth({
    email: req.body.email,
    password: hashedPassword,
    admin: registerAsAdmin,
    provider: EMAIL_KEY,
  });

  // creating user in database
  await newAuthUser.save(async (error, savedUser) => {
    if (savedUser) {
      savedUser.firstName = req.body.name.toString().split(" ")[0];
      savedUser.lastName = req.body.name.toString().split(" ")[1];
      await sendVerificationMail(
        savedUser._id,
        savedUser.email,
        savedUser.firstName + " " + savedUser.lastName
      );
      await _createUserDocument(savedUser);
      return res.status(201).json({
        status: SUCCESS,
        message: VERIFY_MAIL_SENT,
      });
    }
    // Print the error and sent back failed response
    console.log(error);
    return res.status(403).json({
      status: FAILED,
      message: REGISTER_FAILED,
    });
  });
};

/* User login with email   
    - fetch user data
    - [ERROR] if user not found in db, send an error response
    - compare password and hashedpassword using bcrypt
    - try login
*/
module.exports.loginWithEmail = async (req, res, loginAsAdmin) => {
  if (loginAsAdmin === null) loginAsAdmin = false;

  // check if user exists
  var authUser = await getAuthUser(req.body.email);

  if (!authUser)
    return res
      .status(400)
      .json({ status: FAILED, message: INVALID_EMAIL_PASSWORD });

  // validate the password
  const validPass = await _comparePasswords(
    req.body.password,
    authUser.password
  );
  if (!validPass)
    return res.status(400).json({
      status: FAILED,
      message: INCORRECT_PASSWORD,
    });

  loginUser(authUser, loginAsAdmin, EMAIL_KEY, res, false);
};

/* Verify user's account   
    - get the token from query
    - [ERROR] if not found, send an error response
    - send the token for verification
    - if verified, then update the status in db
    - [ERROR] if not verified, send an error response
*/
module.exports.verifyAccByToken = async (req, res) => {
  const token = req.query.t;

  if (!token)
    return res.status(400).json({ status: FAILED, message: INVALID_TOKEN });

  const verified = await verifyUser(token);

  if (!verified)
    return res.status(400).json({
      status: FAILED,
      message: INVALID_EXPIRED_VERIFY_TOKEN,
    });

  const authUser = await Auth.findOne({ _id: verified._userId });

  authUser.emailVerified = true;
  await authUser.save(async (error, savedUser) => {
    if (savedUser)
      return res.status(200).json({
        status: SUCCESS,
        message: ACC_VERIFIED,
      });

    // Print the error and sent back failed response
    console.log(error);
    return res.status(403).json({
      status: FAILED,
      message: ACC_VERIFIED,
    });
  });
};

/* Resending account verification token
    - check if user exists  
    - [ERROR] if not found, send an error response
    - [ERROR] if already verified, send an error response
    - compare passwords
    - [ERROR] passwords do not match, send an error response
    - send new token for verification
*/
module.exports.resendAccVerificatinToken = async (req, res) => {
  const authUser = await getAuthUser(req.body.email);

  if (!authUser)
    return res.status(400).send({ status: FAILED, message: USER_NOT_EXISTS });

  if (authUser.emailVerified)
    return res
      .status(400)
      .send({ status: FAILED, message: ACCOUNT_ALREADY_VERIFIED });

  // validate the password
  const validPass = await _comparePasswords(
    req.body.password,
    authUser.password
  );

  if (!validPass)
    return res.status(401).send({
      status: FAILED,
      message: INCORRECT_PASSWORD,
    });

  const name = await fetchNameOfUser(req.body.email);

  await sendNewVerificationMail(authUser._id, authUser.email, name);

  res.status(200).json({
    status: SUCCESS,
    message: RESENT_VERIFY_EMAIL,
  });
};

/* Update account's password
    - check if user exists  
    - [ERROR] if not found, send an error response
    - compare passwords
    - [ERROR] passwords do not match, send an error response
    - [ERROR] old and new passwords are same, send an error response
    - hash new password
    - update password
*/
module.exports.updatePassword = async (req, res) => {
  var authUser = await getAuthUser(req.tokenData.email);

  if (!authUser)
    return res.status(400).json({ status: FAILED, message: USER_NOT_EXISTS });

  // validate the password
  const validPass = await _comparePasswords(
    req.body.oldPassword,
    authUser.password
  );

  if (!validPass)
    return res.status(400).json({
      status: FAILED,
      message: INCORRECT_PASSWORD,
    });

  const samePassword = await _comparePasswords(
    req.body.newPassword,
    authUser.password
  );

  if (samePassword)
    return res.status(400).json({
      status: FAILED,
      message: OLD_PASSWORD_IS_SAME,
    });

  authUser.password = await _hashThePassword(req.body.newPassword);

  await authUser.save(async (error, savedUser) => {
    if (savedUser)
      return res.status(200).json({
        status: SUCCESS,
        message: PASSWORD_UPDATED,
      });

    // Print the error and sent back failed response
    console.log(error);
    return res.status(403).json({
      status: FAILED,
      message: joinWithCommaSpace(PASSWORD_CHANGE_FAILED, TRY_LATER),
    });
  });
};

/* Sending password reset code
    - check if user exists  
    - [ERROR] if not found, send an error response
    - send new password reset otp to email
*/
module.exports.sendPasswordResetCode = async (req, res) => {
  const authUser = await getAuthUser(req.body.email);

  if (!authUser)
    return res.status(400).json({ status: FAILED, message: USER_NOT_EXISTS });

  await sendOTPForPasswordReset(authUser._id, authUser.email);

  res.status(200).json({
    status: SUCCESS,
    message: OTP_SENT,
  });
};

/* Resending password reset code
    - check if user exists  
    - [ERROR] if not found, send an error response
    - send new password reset otp to email
*/
module.exports.resendPasswordResetCode = async (req, res) => {
  const authUser = await getAuthUser(req.body.email);

  if (!authUser)
    return res.status(400).json({ status: FAILED, message: USER_NOT_EXISTS });

  await resendOTPForPasswordReset(authUser._id, authUser.email);

  res.status(200).json({
    status: SUCCESS,
    message: OTP_RESENT,
  });
};

/* Reset password 
    - verify otp
    - check if user exists  
    - [ERROR] if not found/invalid, send an error response
    - check if new and old passwords are same
    - delete the otp form database
    - hash the password
    - update the password
*/
module.exports.resetPassword = async (req, res) => {
  const verificationToken = await verifyOTP(req.body.otp);
  if (!verificationToken)
    return res.status(400).json({
      status: FAILED,
      message: INVALID_EXPIRED_OTP,
    });

  const authUser = await Auth.findOne({ _id: verificationToken._userId });

  if (!authUser || authUser.email != req.body.email)
    return res.status(400).json({
      status: FAILED,
      message: USER_NOT_EXISTS,
    });

  const samePassword = await _comparePasswords(
    req.body.password,
    authUser.password
  );

  if (samePassword)
    return res.status(400).json({
      status: FAILED,
      message: OLD_PASSWORD_IS_SAME,
    });

  authUser.password = await _hashThePassword(req.body.password);

  await deleteOldToken(verificationToken._userId);

  await authUser.save(async (error, savedUser) => {
    if (savedUser)
      return res.status(200).json({
        status: SUCCESS,
        message: PASSWORD_RESET,
      });

    // Print the error and sent back failed response
    console.log(error);
    return res.status(403).json({
      status: FAILED,
      message: joinWithCommaSpace(PASSWORD_CHANGE_FAILED, TRY_LATER),
    });
  });
};

/* Create new access token
    - check if user exists  
    - [ERROR] if not found/invalid, send an error response
    - check if refresh token sent by user and the one present in db are same
    - [ERROR] if not same, send an error response
    - generate new tokens, verifying  provider access
*/
module.exports.refreshTokens = async (req, res) => {
  var authUser = await Auth.findOne({
    _id: req.tokenData.user_id,
  });

  if (!authUser)
    return res.status(400).json({
      status: FAILED,
      message: USER_NOT_EXISTS,
    });

  // check if refresh token is equal to what we have in the database
  if (authUser.refreshToken === req.refreshToken) {
    if (authUser.provider === EMAIL_KEY) {
      _generateNewTokensAndSendBackToClient(authUser, res);
    } else if (authUser.provider === GOOGLE_KEY) {
      _generateNewTokensAndSendBackToClient(authUser, res);
      // _refreshGoogleAccessToken(authUser, res);
    } else if (authUser.provider === FACEBOOK_KEY) {
      _refreshFbAccessToken(authUser, res);
    } else {
      console.log(`Invalid provider type ${authUser.provider}`);
      return res.status(403).json({
        status: FAILED,
        message: joinWithCommaSpace(TOKEN_REFRESH_FAILED, TRY_LATER),
      });
    }
  } else
    return res.status(400).json({
      status: FAILED,
      message: INVALID_MALFORMED_REFRESH_TOKEN,
    });
};

// Helper method
module.exports.verifyAccessToken = (refreshToken) => {
  return JWTHandler.verifyAccessToken(refreshToken);
};

// Helper method
function verifyRefreshToken(refreshToken) {
  return JWTHandler.verifyRefreshToken(refreshToken);
}

/* Delete's user account
    - check if user exists  
    - [ERROR] if not found/invalid, send an error response
    - delete account
*/
module.exports.deleteAccount = async (req, res) => {
  const authUser = await getAuthUser(req.tokenData.email);
  await Auth.deleteOne({ email: authUser.email }, async (error) => {
    if (error)
      return res.status(403).json({
        status: FAILED,
        message: joinWithCommaSpace(ACC_DELETE_FAILED, TRY_LATER),
      });
    await deleteUser(req.tokenData.email);
    return res.status(200).json({
      status: SUCCESS,
      message: ACC_DELETED,
    });
  });
};

/* Fetch all users
    - fetch users and send in resposne
*/
module.exports.getAllUsers = async (res) => {
  await Auth.find({ admin: false }, { email: 1 }, (error, users) => {
    if (error)
      return res
        .status(403)
        .json({ status: FAILED, message: FETCH_USERS_FAILED });
    return res.status(200).json({
      status: SUCCESS,
      message: FETCHED_USERS,
      data: { users: users },
    });
  });
};

/* Fetch all admins
    - fetch admins and send in resposne
*/
module.exports.getAllAdmins = async (res) => {
  await Auth.find({ admin: true }, { email: 1 }, (error, admins) => {
    if (error)
      return res
        .status(403)
        .json({ status: FAILED, message: FETCH_ADMINS_FAILED });
    return res.status(200).json({
      status: SUCCESS,
      message: FETCHED_ADMINS,
      data: { adming: admins },
    });
  });
};

/* 
  Disable user account
*/
module.exports.disableUser = async (req, res) => {
  await _disableOrEnableUser(req, res, true);
};

/* 
  Enable user account
*/
module.exports.enableUser = async (req, res) => {
  await _disableOrEnableUser(req, res, false);
};

/* Facebook login   
    - sending access token to server to verify if the token is valid 
    - if it's valid, then we will get user data in return
    - [ERROR] if it's not valid, then we will just send an error response to the client
    - check if user is existing/email being used by another account
    - if existing, try login
    - if new, try register
*/
module.exports.loginWithFB = async (req, res) => {
  const userData = await getResponseFromURL(
    FB_OAUTH_URL + req.body.accessToken
  );

  if (userData.error)
    return res.status(403).json({
      status: FAILED,
      message: userData.error.message,
    });

  if (!userData.email)
    return res.status(403).json({
      status: FAILED,
      message: FACEBOOK_LOGIN_FAILED,
    });

  var authUser = await getAuthUser(userData.email);
  if (authUser) {
    // login with facebook
    tryOAuthLogin(authUser, res, req.body.accessToken, FACEBOOK_KEY);
  } else {
    // register with facebook
    tryRegisterWithFacebook(userData, res, req.body.accessToken);
  }
};

/* Google login   
    - sending access token to server to verify if the token is valid 
    - if it's valid, then we will get user data in return
    - [ERROR] if it's not valid, then we will just send an error response to the client
    - check if user is existing/email being used by another account
    - if existing, try login
    - if new, try register
*/
module.exports.loginWithGoogle = async (req, res) => {
  // sending access token to server to verify if the token is valid and return the data
  const userData = await getResponseFromURL(
    GOOGLE_OAUTH_URL + req.body.accessToken
  );

  if (userData.error)
    return res.status(403).json({
      status: FAILED,
      message: userData.error.error_description,
    });

  if (!userData.email)
    return res.status(403).json({
      status: FAILED,
      message: FACEBOOK_GOOGLE_FAILED,
    });

  var authUser = await getAuthUser(userData.email);
  if (authUser) {
    // login with google
    tryOAuthLogin(authUser, res, req.body.accessToken, GOOGLE_KEY);
  } else {
    // register with google
    tryRegisterWithGoogle(userData, res, req.body.accessToken);
  }
};

/*
  -------------------------------------------------------------------------------------
  Helper functions
  -------------------------------------------------------------------------------------
*/
/* Disable or enable user   
    - check if user exists
    - check already disabled/enabled
    - update status in db
*/
async function _disableOrEnableUser(req, res, disable) {
  var authUser = await getAuthUserById(req.body.userId);
  if (!authUser)
    return res.status(403).json({
      status: FAILED,
      message: USER_NOT_EXISTS,
    });

  if (authUser.disabled === disable)
    return res.status(403).json({
      status: FAILED,
      message: joinWithSpace(USER_ACCESS_ALREADY, disable ? DISABLED : ENABLED),
    });

  authUser.disabled = disable;
  authUser.save((error, saved) => {
    if (error)
      return res.status(403).json({
        status: FAILED,
        message: disable ? ACCESS_DISABLE_FAILED : ACCESS_ENABLE_FAILED,
      });

    return res.status(200).json({
      status: SUCCESS,
      message: disable ? ACCESS_DISABLED : ACCESS_ENABLED,
      data: { userId: saved._id },
    });
  });
}

/* 
  Fetches authUser instance from db by userId
*/
async function getAuthUserById(userId) {
  const emailExist = await Auth.findById(userId);
  return emailExist;
}

/* 
  Fetches authUser instance from db by email only specified fields
*/
async function getAuthUserWithProjection(email, project) {
  const emailExist = await Auth.findOne({ email: email }, project);
  return emailExist;
}

/* 
  Fetches authUser instance from db by email
*/
async function getAuthUser(email) {
  const emailExist = await Auth.findOne(
    { email: email },
    { createdAt: 0, updatedAt: 0 }
  );
  return emailExist;
}

/* 
  Encrypt password and return the hashed password
*/
async function _hashThePassword(password) {
  const salt = await bcrypt.genSalt(10);
  const hashPassword = await bcrypt.hash(password, salt);
  return hashPassword;
}

/* 
  Compare encrypted password and plain password
*/
async function _comparePasswords(password, hashedPassword) {
  const validPass = await bcrypt.compare(password, hashedPassword);
  return validPass;
}

/* 
  Makes a GET request to the specified URL and returns data
*/
async function getResponseFromURL(url) {
  const res = await Axios.get(url);
  return res.data;
}

/* Registers the user with Facebook   
    - creates a new auth user instance and saves in db
    - on successful save, login the user
    - [ERROR] failed to save, send error response
*/
async function tryRegisterWithFacebook(fbUser, res, accessToken) {
  const authUser = new Auth({
    email: fbUser.email,
    emailVerified: true,
    provider: FACEBOOK_KEY,
    oauthToken: accessToken,
  });

  await authUser.save(async (error, savedUser) => {
    if (savedUser) {
      savedUser.firstName = fbUser.first_name;
      savedUser.lastName = fbUser.last_name;
      await _createUserDocument(savedUser);
      loginUser(savedUser, false, FACEBOOK_KEY, res, true);
    } else {
      // Print the error and sent back failed response
      console.log(error);
      return res.status(403).json({
        status: FAILED,
        message: FB_REGISTER_FAILED,
      });
    }
  });
}

/* Registers the user with Google   
    - creates a new auth user instance and saves in db
    - on successful save, login the user
    - [ERROR] failed to save, send error response
*/
async function tryRegisterWithGoogle(googleUser, res, accessToken) {
  const authUser = new Auth({
    email: googleUser.email,
    emailVerified: true,
    provider: GOOGLE_KEY,
    oauthToken: accessToken,
  });

  await authUser.save(async (error, savedUser) => {
    if (savedUser) {
      savedUser.firstName = googleUser.name.toString().split(" ")[0];
      savedUser.lastName = googleUser.name.toString().split(" ")[1];
      savedUser.photoUrl = googleUser.picture;
      await _createUserDocument(savedUser);
      loginUser(savedUser, false, GOOGLE_KEY, res, true);
    } else {
      // Print the error and sent back failed response
      console.log(error);
      return res.status(403).json({
        status: FAILED,
        message: GOOGLE_REGISTER_FAILED,
      });
    }
  });
}

/* Logs in the user - OAuth
    - save the oauth access token
    - login user
*/
async function tryOAuthLogin(authUser, res, accessToken, loginProvider) {
  if (authUser.provider === loginProvider) {
    authUser.oauthToken = accessToken;
    loginUser(authUser, false, loginProvider, res, false);
  } else {
    return res.status(400).json({
      status: FAILED,
      message: EMAIL_IN_USE_BY_OTHER_PROVIDER,
    });
  }
}

/* Login user   
    - check if email is verified
    - check if access is denied for the user
    - [ERROR] if user tries to login with diff route then throw error(admin)
    - generate access and refresh tokens 
    - save tokens and send back to client
*/
async function loginUser(authUser, loginAsAdmin, provider, res, isSignup) {
  if (!authUser.emailVerified)
    return res.status(403).json({
      status: FAILED,
      message: ACCOUNT_NOT_VERIFIED,
    });

  if (authUser.disabled)
    return res.status(401).json({
      status: FAILED,
      message: ACC_DISABLED,
    });

  // if user is not an admin and trying to login through admin login route
  // throw error
  // if user is an admin and trying to login through normal login route
  // throw error
  if ((!loginAsAdmin && authUser.admin) || (loginAsAdmin && !authUser.admin))
    return res.status(400).json({
      status: FAILED,
      message: LOGIN_NOT_ALLOWED,
    });

  if (loginAsAdmin && !authUser.adminVerified)
    return res.status(400).json({
      status: FAILED,
      message: ACC_UNDER_REVIEW,
    });

  authUser = await _createNewRefreshTokenIfAboutToExpire(authUser);

  const accessToken = await JWTHandler.genAccessToken(authUser.email);

  // saving refresh-token in database
  await authUser.save(async (error, savedUser) => {
    if (savedUser) {
      return res
        .status(200)
        .header(ACCESS_TOKEN, accessToken)
        .header(REFRESH_TOKEN, authUser.refreshToken)
        .json(
          provider === EMAIL_KEY
            ? {
                status: SUCCESS,
                message: LOGIN_SUCCESS,
              }
            : {
                status: SUCCESS,
                message: joinWithSpace(provider, LOGIN_SUCCESS),
                signup: isSignup,
              }
        );
    }
    // Print the error and sent back failed response
    console.log(error);
    return res.status(403).json({
      status: FAILED,
      message: joinWithCommaSpace(LOGIN_FAILED, TRY_LATER),
    });
  });
}

/* Gets new access tokens from Facebook server   
    - make a get request and return data
*/
async function _getNewFbAccessToken(oldAccessToken) {
  const tokenData = await getResponseFromURL(FB_OAUTH_REFRESH + oldAccessToken);
  return tokenData;
}

/* 
  Creates new access and refresh tokens and send back to client
*/
async function _generateNewTokensAndSendBackToClient(authUser, res) {
  const newAccessToken = await JWTHandler.genAccessToken(authUser.email);

  authUser = await _createNewRefreshTokenIfAboutToExpire(authUser);

  await authUser.save(async (error, savedUser) => {
    if (savedUser) {
      return res
        .status(200)
        .header(ACCESS_TOKEN, newAccessToken)
        .header(REFRESH_TOKEN, authUser.refreshToken)
        .json({
          status: SUCCESS,
          message: TOKENS_REFRESHED,
        });
    }
    // Print the error and sent back failed response
    console.log(error);
    return res.status(403).json({
      status: FAILED,
      message: TOKEN_REFRESH_FAILED,
    });
  });
}

/* 
  Creates new access and refresh tokens and send back to client
  - check if there is any issue with refreshing the token
  - if the user has revoked the permission for this application in fb dashboard
    then the user will be logged out here in the application too when he requests
    for a new accessToken
*/
async function _refreshFbAccessToken(authUser, res) {
  const newAccessTokenData = await _getNewFbAccessToken(authUser.oauthToken);

  if (newAccessTokenData.error) {
    console.log(
      `Failed to get new accessToken from fb ${newAccessTokenData.message}`
    );

    if (newAccessTokenData.message.toString().toLowerCase().includes(EXPIRE)) {
      return res.status(401).json({
        status: FAILED,
        message: SESSION_EXPIRED,
        error: newAccessTokenData.message,
      });
    }

    return res.status(403).json({
      status: FAILED,
      message: OAUTH_LOGIN_FAILED,
      error: newAccessTokenData.message,
    });
  }

  if (newAccessTokenData.access_token) {
    // everything is fine, generate tokens and send back to client
    authUser.oauthToken = newAccessTokenData.access_token;
    _generateNewTokensAndSendBackToClient(authUser, res);
  } else {
    return res.status(403).json({
      status: FAILED,
      message: OAUTH_TOKEN_REFRESH_ERROR,
    });
  }
}

/*
  Verifies if the refreshToken is about to expire in less than a day
  if true : creates new refreshToken
  else : send the old token
*/
async function _createNewRefreshTokenIfAboutToExpire(authUser) {
  if (authUser.refreshToken) {
    const refreshTokenData = verifyRefreshToken(authUser.refreshToken).data;
    var timeToExpiry = refreshTokenData.exp - Date.now() / 1000;

    // looks like we have still more days for our refresh token to expire
    if (timeToExpiry > 0) {
      if (timeToExpiry / 86400 > 2) {
        return authUser;
      }
    }
  }
  // token might expire soon, so creating new token
  authUser.refreshToken = await JWTHandler.genRefreshToken(authUser._id);
  return authUser;
}

//function _refreshGoogleAccessToken(authUser, res) {}

/*
  Create user document(only done while registration)
*/
async function _createUserDocument(userData) {
  await createUser(userData);
}

module.exports.getAuthUser = getAuthUser;
module.exports.getAuthUserWithProjection = getAuthUserWithProjection;
module.exports.verifyRefreshToken = verifyRefreshToken;
