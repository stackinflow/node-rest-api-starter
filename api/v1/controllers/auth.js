const Auth = require("../models/auth");
const bcrypt = require("bcryptjs");
const jwt = require("../../../core/jwt");
const JWTHandler = new jwt();

module.exports.register = async (req, res) => {
  // check if user exists
  const authUser = await _getAuthUser(req.body.email);

  if (authUser) {
    return res
      .status(409)
      .json({ status: "failed", message: "Email already exists" });
  }

  const hashedPassword = await _hashThePassword(req.body.password);

  // create user form data
  const newAuthUser = new Auth({
    email: req.body.email,
    password: hashedPassword,
  });

  // creating user in database
  await newAuthUser.save(async (error, savedUser) => {
    if (savedUser) {
      return res.status(201).json({
        status: "success",
        message: "Successfully registered",
      });
    }
    // Print the error and sent back failed response
    console.log(error);
    res.status(403).json({
      status: "failed",
      message: "Unable to register please try later",
    });
  });
};

module.exports.login = async (req, res) => {
  // check if user exists
  const authUser = await _getAuthUser(req.body.email);

  if (!authUser) {
    return res
      .status(400)
      .json({ status: "failed", message: "Email or password is invalid" });
  }

  // validate the password
  const validPass = await bcrypt.compare(req.body.password, authUser.password);
  if (!validPass) {
    return res.status(400).json({
      status: "failed",
      message: "You have entered an incorrect password",
    });
  }

  if (!authUser.emailVerified) {
    return res.status(403).json({
      status: "failed",
      message: "Account not verified",
    });
  }

  if (authUser.banned) {
    return res.status(403).json({
      status: "failed",
      message:
        "Your account has been banned for suspicious activity, please contact support for more information.",
    });
  }

  //  Create and assign a token
  const refreshToken = await JWTHandler.genRefreshToken(authUser._id);

  const accessToken = await JWTHandler.genAccessToken(authUser.email);

  authUser.refreshToken = refreshToken;

  // saving refresh-token in database
  await authUser.save();

  res
    .header("access-token", accessToken)
    .header("refresh-token", refreshToken)
    .status(200)
    .json({
      status: "success",
      message: "User has been logged in successfully",
    });
};

/*

  Helper functions

*/

async function _getAuthUser(email) {
  const emailExist = await Auth.findOne({ email: email });
  return emailExist;
}

async function _hashThePassword(password) {
  // Hash the password
  const salt = await bcrypt.genSalt(10);
  const hashPassword = await bcrypt.hash(password, salt);
  return hashPassword;
}
