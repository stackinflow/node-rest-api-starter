const router = require("express").Router();
const {
  validateRegisterFields,
  validPassword,
  validPasswords,
  validEmail,
  validResetFields,
  validateRefreshToken,
  validateAccessToken,
  checkRefreshToken,
  checkAccessToken,
  checkUserAccess,
  checkOAuthAccessToken,
} = require("../middlewares/auth");
const {
  registerWithEmail,
  loginWithEmail,
  resendAccVerificatinToken,
  verifyAccByToken,
  updatePassword,
  sendPasswordResetCode,
  resendPasswordResetCode,
  resetPassword,
  refreshTokens,
  deleteAccount,
  loginWithFB,
  loginWithGoogle,
} = require("../controllers/auth");
const { internalServerError } = require("../utils/response");

/* user registration route
    - validate body
    - validate password
*/
router.post(
  "/register",
  //  checkAuthHeader,
  validateRegisterFields,
  validPassword,
  async (req, res) => {
    try {
      await registerWithEmail(req, res, false);
    } catch (error) {
      internalServerError(res, error);
    }
  }
);

/* user login route
    - validate body
    - validate password
*/
router.post(
  "/login",
  validateRegisterFields,
  validPassword,
  async (req, res) => {
    try {
      await loginWithEmail(req, res, false);
    } catch (error) {
      internalServerError(res, error);
    }
  }
);

/* 
  user account verification
*/
router.get("/token/verify", async (req, res) => {
  try {
    await verifyAccByToken(req, res);
  } catch (error) {
    internalServerError(res, error);
  }
});

/* resends account verification token
    - validate body(email and password)
    - validate password
*/
router.post(
  "/token/resend",
  validateRegisterFields,
  validPassword,
  async (req, res) => {
    try {
      await resendAccVerificatinToken(req, res);
    } catch (error) {
      internalServerError(res, error);
    }
  }
);

/* updates password
    - check if access-token is passed
    - validate access-token
    - validate passwords
*/
router.patch(
  "/password",
  checkAccessToken,
  validateAccessToken,
  validPasswords,
  checkUserAccess,
  async (req, res) => {
    try {
      await updatePassword(req, res);
    } catch (error) {
      internalServerError(res, error);
    }
  }
);

/* sends an otp to email for resetting the password
    - validate email
*/
router.post("/password/reset/code", validEmail, async (req, res) => {
  try {
    await sendPasswordResetCode(req, res);
  } catch (error) {
    internalServerError(res, error);
  }
});

/* sends an otp to email for resetting the password
    - validate email
*/
router.post("/password/reset/code/resend", validEmail, async (req, res) => {
  try {
    await resendPasswordResetCode(req, res);
  } catch (error) {
    internalServerError(res, error);
  }
});

/* resets password
    - validate otp
    - validate passwords
*/
router.post(
  "/password/reset",
  validResetFields,
  validPassword,
  async (req, res) => {
    try {
      await resetPassword(req, res);
    } catch (error) {
      internalServerError(res, error);
    }
  }
);

/* refresh access token
    - check if refresh-token is passed
    - validate refresh-token
*/
router.get(
  "/token",
  checkRefreshToken,
  validateRefreshToken,
  async (req, res) => {
    try {
      await refreshTokens(req, res);
    } catch (error) {
      internalServerError(res, error);
    }
  }
);

/* deletes users' account
    - check if access-token is passed
    - validate access-token
*/
router.delete("/", checkAccessToken, validateAccessToken, async (req, res) => {
  try {
    await deleteAccount(req, res);
  } catch (error) {
    internalServerError(res, error);
  }
});

/* login or register with facebook
    - check if oauth access-token is passed
*/
router.post("/facebook", checkOAuthAccessToken, async (req, res) => {
  try {
    await loginWithFB(req, res);
  } catch (error) {
    internalServerError(res, error);
  }
});

/* login or register with google
    - check if oauth access-token is passed
*/
router.post("/google", checkOAuthAccessToken, async (req, res) => {
  try {
    await loginWithGoogle(req, res);
  } catch (error) {
    internalServerError(res, error);
  }
});

module.exports = router;
