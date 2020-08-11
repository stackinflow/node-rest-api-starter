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
const { ACCESS_TOKEN, REFRESH_TOKEN } = require("../utils/constants");

module.exports.register = async (req, res, registerAsAdmin) => {
  if (registerAsAdmin === null) registerAsAdmin = false;
  // check if user exists
  const authUser = await getAuthUser(req.body.email);

  if (authUser)
    return res
      .status(409)
      .json({ status: "failed", message: "Email already exists" });

  const hashedPassword = await _hashThePassword(req.body.password);

  // create user form data
  const newAuthUser = new Auth({
    email: req.body.email,
    password: hashedPassword,
    admin: registerAsAdmin,
  });

  // creating user in database
  await newAuthUser.save(async (error, savedUser) => {
    if (savedUser) {
      await sendVerificationMail(savedUser._id, savedUser.email);
      return res.status(201).json({
        status: "success",
        message:
          "A verification link has been sent to your email, please verify your email",
      });
    }
    // Print the error and sent back failed response
    console.log(error);
    return res.status(403).json({
      status: "failed",
      message: "Unable to register please try later",
    });
  });
};

module.exports.login = async (req, res, loginAsAdmin) => {
  if (loginAsAdmin === null) loginAsAdmin = false;

  // check if user exists
  const authUser = await getAuthUser(req.body.email);

  if (!authUser)
    return res
      .status(400)
      .json({ status: "failed", message: "Email or password is invalid" });

  // validate the password
  const validPass = await _comparePasswords(
    req.body.password,
    authUser.password
  );
  if (!validPass)
    return res.status(400).json({
      status: "failed",
      message: "You have entered an incorrect password",
    });

  if (!authUser.emailVerified)
    return res.status(403).json({
      status: "failed",
      message:
        "Account not verified, please check your email and verify your account",
    });

  if (authUser.disabled)
    return res.status(403).json({
      status: "failed",
      message:
        "Your account has been disabled access for suspicious activity, please contact support for more information.",
    });

  // if user is not an admin and trying to login through admin login route
  // throw error
  // if user is an admin and trying to login through normal login route
  // throw error
  if ((!loginAsAdmin && authUser.admin) || (loginAsAdmin && !authUser.admin))
    return res.status(400).json({
      status: "failed",
      message: "You are not allowed to login here.",
    });

  if (loginAsAdmin && !authUser.adminVerified)
    return res.status(400).json({
      status: "failed",
      message:
        "Your account is under review, please contact support for more information.",
    });

  //  Create and assign a token
  const refreshToken = await JWTHandler.genRefreshToken(authUser._id);

  const accessToken = await JWTHandler.genAccessToken(authUser.email);

  authUser.refreshToken = refreshToken;

  // saving refresh-token in database
  await authUser.save(async (error, savedUser) => {
    if (savedUser) {
      return res
        .status(200)
        .header(ACCESS_TOKEN, accessToken)
        .header(REFRESH_TOKEN, refreshToken)
        .json({
          status: "success",
          message: "User has been logged in successfully",
        });
    }
    // Print the error and sent back failed response
    console.log(error);
    return res.status(403).json({
      status: "failed",
      message: "Unable to login please try later",
    });
  });
};

module.exports.verifyToken = async (req, res) => {
  // console.log("Verifying user account");
  const token = req.query.t;

  if (!token)
    return res
      .status(400)
      .json({ status: "failed", message: "Invalid request" });

  const verified = await verifyUser(token);

  if (!verified)
    return res.status(400).json({
      status: "success",
      message: "Verification token expired/invalid",
    });

  const authUser = await Auth.findOne({ _id: verified._userId });

  authUser.emailVerified = true;
  await authUser.save(async (error, savedUser) => {
    if (savedUser)
      return res.status(200).json({
        status: "success",
        message: "Your account has been verified, please login now",
      });

    // Print the error and sent back failed response
    console.log(error);
    return res.status(403).json({
      status: "failed",
      message: "Unable to verify your account, please try later",
    });
  });
};

module.exports.resendToken = async (req, res) => {
  console.log("Resend verification token");

  // check if user exists
  const authUser = await getAuthUser(req.body.email);

  if (!authUser)
    return res.status(400).send({ status: "failed", message: "Invalid user" });

  if (authUser.emailVerified)
    return res
      .status(400)
      .send({ status: "failed", message: "Account already verified" });

  // validate the password
  const validPass = await _comparePasswords(
    req.body.password,
    authUser.password
  );

  if (!validPass)
    return res.status(401).send({
      status: "failed",
      message: "You have entered an incorrect password",
    });

  await sendNewVerificationMail(authUser._id, authUser.email);

  res.status(200).json({
    status: "success",
    message: "Verification token has been resent to your email",
  });
};

module.exports.updatePassword = async (req, res) => {
  const authUser = await getAuthUser(req.tokenData.email);

  if (!authUser)
    return res.status(400).json({ status: "failed", message: "Invalid user" });

  // validate the password
  const validPass = await _comparePasswords(
    req.body.oldPassword,
    authUser.password
  );

  if (!validPass)
    return res.status(400).json({
      status: "failed",
      message: "You have entered an incorrect password",
    });

  const samePassword = await _comparePasswords(
    req.body.newPassword,
    authUser.password
  );

  if (samePassword)
    return res.status(400).json({
      status: "failed",
      message: "Old password can not be new password",
    });

  authUser.password = await _hashThePassword(req.body.newPassword);

  await authUser.save(async (error, savedUser) => {
    if (savedUser)
      return res.status(200).json({
        status: "success",
        message: "Your password has been changed",
      });

    // Print the error and sent back failed response
    console.log(error);
    return res.status(403).json({
      status: "failed",
      message: "Unable to change your password, please try later",
    });
  });
};

module.exports.sendPasswordResetCode = async (req, res) => {
  console.log("Sending password reset code");

  // check if user exists
  const authUser = await getAuthUser(req.body.email);

  if (!authUser)
    return res.status(400).json({ status: "failed", message: "Invalid user" });

  await sendOTPForPasswordReset(authUser._id, authUser.email);

  res.status(200).json({
    status: "success",
    message:
      "An OTP has been sent to your email, please enter that to reset your password",
  });
};

module.exports.resendPasswordResetCode = async (req, res) => {
  // console.log("Sending password reset code");

  // check if user exists
  const authUser = await getAuthUser(req.body.email);

  if (!authUser)
    return res.status(400).json({ status: "failed", message: "Invalid user" });

  await resendOTPForPasswordReset(authUser._id, authUser.email);

  res.status(200).json({
    status: "success",
    message:
      "An OTP has been sent to your email, please enter that to reset your password",
  });
};

module.exports.resetPassword = async (req, res) => {
  const verificationToken = await verifyOTP(req.body.otp);
  if (!verificationToken)
    return res.status(400).json({
      status: "failed",
      message: "OTP is invalid/expired, please request for new OTP",
    });

  const authUser = await Auth.findOne({ _id: verificationToken._userId });

  if (!authUser || authUser.email != req.body.email)
    return res.status(400).json({
      status: "failed",
      message: "Invalid user",
    });

  const samePassword = await _comparePasswords(
    req.body.password,
    authUser.password
  );

  if (samePassword)
    return res.status(400).json({
      status: "failed",
      message: "Old password can not be new password",
    });

  authUser.password = await _hashThePassword(req.body.password);

  await deleteOldToken(verificationToken._userId);

  await authUser.save(async (error, savedUser) => {
    if (savedUser)
      return res.status(200).json({
        status: "success",
        message: "Your password has been reset, please login now",
      });

    // Print the error and sent back failed response
    console.log(error);
    return res.status(403).json({
      status: "failed",
      message: "Unable to change your password, please try later",
    });
  });
};

module.exports.refreshTokens = async (req, res) => {
  const authUser = await Auth.findOne({
    _id: req.tokenData.user_id,
  });

  if (!authUser)
    return res.status(400).json({
      status: "failed",
      message: "Invalid user",
    });

  if (authUser.refreshToken === req.refreshToken) {
    const newAccessToken = await JWTHandler.genAccessToken(authUser.email);
    const newRefreshToken = await JWTHandler.genRefreshToken(authUser._id);

    authUser.refreshToken = newRefreshToken;

    await authUser.save(async (error, savedUser) => {
      if (savedUser) {
        return res
          .status(200)
          .header(ACCESS_TOKEN, newAccessToken)
          .header(REFRESH_TOKEN, newRefreshToken)
          .json({
            status: "success",
            message: "Tokens have been refreshed",
          });
      }
      // Print the error and sent back failed response
      console.log(error);
      return res.status(403).json({
        status: "failed",
        message: "Unable to refresh the token, please try later",
      });
    });
  } else
    return res.status(400).json({
      status: "failed",
      message: "Invalid/malformed refreshToken",
    });
};

module.exports.verifyAccessToken = (refreshToken) => {
  return JWTHandler.verifyAccessToken(refreshToken);
};

module.exports.verifyRefreshToken = (refreshToken) => {
  return JWTHandler.verifyRefreshToken(refreshToken);
};

module.exports.deleteAccount = async (req, res) => {
  const authUser = await getAuthUser(req.tokenData.email);
  await Auth.deleteOne({ email: authUser.email }, (error) => {
    if (error)
      return res.status(403).json({
        status: "failed",
        message: "Failed to deleted your account, please try again",
      });
    return res.status(200).json({
      status: "success",
      message: "Your account has been deleted successfully",
    });
  });
};

module.exports.getAllUsers = async (res) => {
  await Auth.find({ admin: false }, { email: 1 }, (error, users) => {
    if (error)
      return res
        .status(403)
        .json({ status: "failed", message: "Failed to fetch users" });
    return res.status(200).json({
      status: "success",
      message: "fetched users",
      data: { users: users },
    });
  });
};

module.exports.getAllAdmins = async (res) => {
  await Auth.find({ admin: true }, { email: 1 }, (error, admins) => {
    if (error)
      return res
        .status(403)
        .json({ status: "failed", message: "Failed to fetch admins" });
    return res.status(200).json({
      status: "success",
      message: "fetched admins",
      data: { adming: admins },
    });
  });
};

module.exports.disableUser = async (req, res) => {
  await _disableOrEnableUser(req, res, true);
};

module.exports.enableUser = async (req, res) => {
  await _disableOrEnableUser(req, res, false);
};

/*

  Helper functions

*/

async function _disableOrEnableUser(req, res, disable) {
  var authUser = await getAuthUserById(req.body.userId);
  if (!authUser)
    return res.status(403).json({
      status: "failed",
      message: "User requested doesn't exists",
    });

  if (authUser.disabled === disable)
    return res.status(403).json({
      status: "failed",
      message: `User already has access ${disable ? "disabled" : "enabled"}`,
    });

  authUser.disabled = disable;
  authUser.save((error, saved) => {
    if (error)
      return res.status(403).json({
        status: "failed",
        message: "Failed to disable user access",
      });

    return res.status(200).json({
      status: "success",
      message: `User with id ${saved._id} ${
        disable ? "disabled" : "enabled"
      } access successfully`,
    });
  });
}

async function getAuthUserById(userId) {
  const emailExist = await Auth.findById(userId);
  return emailExist;
}

async function getAuthUserWithProjection(email, project) {
  const emailExist = await Auth.findOne({ email: email }, project);
  return emailExist;
}

async function getAuthUser(email) {
  const emailExist = await Auth.findOne({ email: email });
  return emailExist;
}

async function _hashThePassword(password) {
  // Hash the password
  const salt = await bcrypt.genSalt(10);
  const hashPassword = await bcrypt.hash(password, salt);
  return hashPassword;
}

async function _comparePasswords(password, hashedPassword) {
  const validPass = await bcrypt.compare(password, hashedPassword);
  return validPass;
}

module.exports.getAuthUser = getAuthUser;
module.exports.getAuthUserWithProjection = getAuthUserWithProjection;
