const router = require("express").Router();
const {
  validateRegisterFields,
  validPassword,
  validPasswords,
  validEmail,
  validResetFields,
  // checkAuthHeader,
  validateRefreshToken,
  validateAccessToken,
  checkRefreshToken,
  checkAccessToken,
  checkUser,
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

router.post(
  "/login",
  // checkAuthHeader,
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

router.get("/token/verify", async (req, res) => {
  try {
    await verifyAccByToken(req, res);
  } catch (error) {
    internalServerError(res, error);
  }
});

router.post(
  "/token/resend",
  // checkAuthHeader,
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

router.patch(
  "/password",
  checkAccessToken,
  validateAccessToken,
  validPasswords,
  checkUser,
  async (req, res) => {
    try {
      await updatePassword(req, res);
    } catch (error) {
      internalServerError(res, error);
    }
  }
);

router.post("/password/reset/code", validEmail, async (req, res) => {
  try {
    await sendPasswordResetCode(req, res);
  } catch (error) {
    internalServerError(res, error);
  }
});

router.post("/password/reset/code/resend", validEmail, async (req, res) => {
  try {
    await resendPasswordResetCode(req, res);
  } catch (error) {
    internalServerError(res, error);
  }
});

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

router.delete("/", checkAccessToken, validateAccessToken, async (req, res) => {
  try {
    await deleteAccount(req, res);
  } catch (error) {
    internalServerError(res, error);
  }
});

router.post("/facebook", checkOAuthAccessToken, async (req, res) => {
  try {
    await loginWithFB(req, res);
  } catch (error) {
    internalServerError(res, error);
  }
});

router.post("/google", checkOAuthAccessToken, async (req, res) => {
  try {
    await loginWithGoogle(req, res);
  } catch (error) {
    internalServerError(res, error);
  }
});

module.exports = router;
