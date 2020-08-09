const Token = require("../models/token");
const crypto = require("crypto");
const send_email = require("../utils/send_email");
const mailer = new send_email();
const otpGen = require("otp-generator");

module.exports.resendOTPForPasswordReset = async (userId, email) => {
  await _deleteOldToken(userId);
  await this.sendOTPForPasswordReset(userId, email);
};

module.exports.sendOTPForPasswordReset = async (userId, email) => {
  const oldToken = await _getToken(userId);
  if (oldToken) {
    return false;
  }

  const otp = otpGen.generate(6, {
    upperCase: false,
    specialChars: false,
    alphabets: false,
  });

  // gen verification token and saving that token in db, which will expire in an hour
  const token = new Token({ _userId: userId, token: otp });
  await token.save();
  mailer.pwdReset(otp, email);
  return true;
};

module.exports.sendNewVerificationMail = async (userId, email) => {
  await _deleteOldToken(userId);
  await this.sendVerificationMail(userId, email);
};

module.exports.sendVerificationMail = async (userId, email) => {
  // gen verification token and saving that token in db, which will expire in an hour
  const token = new Token({
    _userId: userId,
    token: crypto.randomBytes(64).toString("hex"),
  });

  await token.save();
  //console.log(token.token);
  mailer.accVerification(token.token, email);
};

async function _getToken(userId) {
  const token = await Token.findOne({ _userId: userId });
  return token;
}

async function _deleteOldToken(userId) {
  await Token.deleteOne({ _userId: userId });
}

module.exports.verifyUser = async (token) => {
  const verificationToken = await Token.findOne({ token: token });
  if (!verificationToken) return;
  await _deleteOldToken(verificationToken._userId);
  return verificationToken;
};

module.exports.verifyOTP = async (otp) => {
  const verificationToken = await Token.findOne({ token: otp });
  if (!verificationToken) return;
  return verificationToken;
};

module.exports.deleteOldToken = _deleteOldToken;
