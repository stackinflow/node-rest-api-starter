const Token = require("../models/token");
const crypto = require("crypto");
const send_email = require("../utils/send_email");
const mailer = new send_email();

module.exports.sendNewVerificationMail = async (userId, email) => {
  // gen verification token and saving that token in db, which will expire in an hour
  const token = new Token({
    _userId: userId,
    token: crypto.randomBytes(64).toString("hex"),
  });

  await token.save();
  //console.log(token.token);
  mailer.accVerification(token.token, email);
};

module.exports.verifyUser = async (token) => {
  const verificationToken = await Token.findOne({ token: token });
  if (!verificationToken) return;
  await Token.deleteOne({ _id: verificationToken._id });
  return verificationToken;
};
