/*
 * if you want to add a custom role
 * 1. Add the entry in accRoles
 * 2. Write custom auth middlewares to check if role matches
 */
const getValuesArrayFromMap = require("../../../../core/helpers")
  .getValuesArrayFromMap;

const accRoles = {
  normalUser: "normal_user",
  admin: "admin",
};

const accountStatus = {
  // operations allowed by users
  emailVerificationPending: "email_verification_pending",
  deactivated: "deactivated",

  // automatically applied by API
  //  if the type of user is normal_user and he verifies his email, then status will be set to active
  active: "active",
  //  if the type of user is admin or any custom role and he verifies his email, then status will be set to pending for review by admin
  //  once the admin approves, then status will be set to approved
  pending: "pending",

  // operations allowed by admin
  adminApproved: "approved",
  adminRejected: "rejected",
  suspended: "suspended",
  disabled: "disabled",
};

const tokenTypes = {
  accVerification: "acc_verification",
  pwdReset: "pwd_reset",
};

const tokensList = getValuesArrayFromMap(tokenTypes);
const rolesList = getValuesArrayFromMap(accRoles);
const accountStatusesList = getValuesArrayFromMap(accountStatus);

module.exports.tokensList = tokensList;
module.exports.accRolesList = rolesList;
module.exports.accountStatusList = accountStatusesList;
module.exports.accRoles = accRoles;
module.exports.accountStatus = accountStatus;
module.exports.tokenTypes = tokenTypes;
