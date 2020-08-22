const mongoose = require("mongoose");
const { AUTH_COLLECTION } = require("../utils/constants").collections;

const authSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: true,
      min: 5,
      unique: true,
    },
    password: {
      type: String,
      min: 8,
      max: 1024,
    },
    admin: {
      type: Boolean,
      default: false,
    },
    adminVerified: {
      type: Boolean,
      default: false,
    },
    disabled: {
      type: Boolean,
      default: false,
    },
    emailVerified: {
      type: Boolean,
      default: false,
    },
    provider: String,
    refreshToken: {
      type: String,
    },
    oauthToken: {
      type: String,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model(AUTH_COLLECTION, authSchema);
