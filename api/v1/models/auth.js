const mongoose = require("mongoose");
const { AUTH_COLLECTION } = require("../utils/constants").collections;
const account = require("../utils/constants").account;

// console.log(account.accRolesList);
// console.log(account.accountStatusList);

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
    role: {
      type: String,
      default: account.accRoles.normalUser,
      enum: account.accRolesList,
    },
    status: {
      type: String,
      default: account.accountStatus.emailVerificationPending,
      enum: account.accountStatusList,
    },
    /*
    replaced by role and status
    ---------------------------
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
    */
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
