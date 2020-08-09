const path = require("path");
const fs = require("fs");
const jwt = require("jsonwebtoken");
require("dotenv").config();

const _privateKeyPath = "../keys/private.pem";
const _publicKeyPath = "../keys/public.pem";
const _privateRefreshKeyPath = "../keys/privater.pem";
const _publicRefreshKeyPath = "../keys/publicr.pem";

class JWTHandler {
  constructor() {
    this._fetchKeys();
  }

  _fetchKeys() {
    console.log("fetching keys");

    this._privateKey = fs.readFileSync(
      path.join(__dirname, _privateKeyPath),
      "utf8"
    );
    this._publicKey = fs.readFileSync(
      path.join(__dirname, _publicKeyPath),
      "utf8"
    );
    this._RprivateKey = fs.readFileSync(
      path.join(__dirname, _privateRefreshKeyPath),
      "utf8"
    );
    this._RpublicKey = fs.readFileSync(
      path.join(__dirname, _publicRefreshKeyPath),
      "utf8"
    );
  }

  async genAccessToken(email) {
    if (!this._privateKey) {
      console.log("re fetching key");
      this._privateKey = fs.readFileSync(
        path.join(__dirname, _privateKeyPath),
        "utf8"
      );
    }
    // expires after 1 day
    // return this._genJWT(
    //   this._payloadAccessToken(email),
    //   this._privateKey,
    //   "1d"
    // );

    // fetch expiry time from .env
    return this._genJWT(
      this._payloadAccessToken(email),
      this._privateKey,
      process.env.ACCESS_TOKEN_EXPIRES
    );

    // never expires
    // return this._genJWT(
    //   this._payloadAccessToken(email),
    //   this._privateKey
    // );
  }

  async genRefreshToken(user_id) {
    if (!this._RprivateKey) {
      console.log("re fetching key");
      this._RprivateKey = fs.readFileSync(
        path.join(__dirname, _privateRefreshKeyPath),
        "utf8"
      );
    }
    // expires after 30 days
    // return this._genJWT(
    //   this._payloadRefreshToken(user_id),
    //   this._RprivateKey,
    //   "30d"
    // );

    // fetch expiry time from .env
    return this._genJWT(
      this._payloadRefreshToken(user_id),
      this._RprivateKey,
      process.env.REFRESH_TOKEN_EXPIRES
    );

    // never expires
    // return this._genJWT(
    //   this._payloadRefreshToken(user_id),
    //   this._RprivateKey
    // );
  }

  verifyAccessToken(token) {
    return this._decodeJWT(token, this._publicKey);
  }

  verifyRefreshToken(token) {
    return this._decodeJWT(token, this._RpublicKey);
  }

  _decodeJWT(token, cert) {
    try {
      return { valid: true, data: jwt.verify(token, cert) };
    } catch (err) {
      if (err.name.includes("TokenExpiredError")) {
        return { valid: false, error: "Token Expired" };
      }
      return { valid: false, error: err };
    }
  }

  _genJWT(payload, cert, expiresIn) {
    return jwt.sign(payload, cert, {
      expiresIn: expiresIn,
      algorithm: "RS256",
    });
  }

  _payloadAccessToken(email) {
    return {
      aud: process.env.TOKEN_AUDIENCE,
      sub: process.env.TOKEN_SUBJECT + "_AccessToken",
      iss: process.env.TOKEN_ISSUER,
      email: email,
    };
  }

  _payloadRefreshToken(user_id) {
    return {
      aud: process.env.TOKEN_AUDIENCE,
      sub: process.env.TOKEN_SUBJECT + "_RefreshToken",
      iss: process.env.TOKEN_ISSUER,
      user_id: user_id,
    };
  }
}

module.exports = JWTHandler;
