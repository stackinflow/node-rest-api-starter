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
} = require("../middlewares/auth");
const {
  register,
  login,
  verifyToken,
  resendToken,
  updatePassword,
  sendPasswordResetCode,
  resendPasswordResetCode,
  resetPassword,
  refreshTokens,
  deleteAccount,
} = require("../controllers/auth");
const { internalServerError } = require("../utils/response");

router.post(
  "/register",
  //  checkAuthHeader,
  validateRegisterFields,
  validPassword,
  async (req, res) => {
    try {
      await register(req, res, false);
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
      await login(req, res, false);
    } catch (error) {
      internalServerError(res, error);
    }
  }
);

router.get("/token/verify", async (req, res) => {
  try {
    await verifyToken(req, res);
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
      await resendToken(req, res);
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

module.exports = router;
