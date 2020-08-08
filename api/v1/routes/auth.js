const router = require("express").Router();
const {
  validateRegisterFields,
  validPassword,
  validateLoginFields,
} = require("../middlewares/auth");
const {
  register,
  login,
  verifyToken,
  resendToken,
} = require("../controllers/auth");
const { internalServerError } = require("../utils/response");

// Routes to be defined
// 1  Register
// 2  Login
// 3  Reset password initiate
// 4  Reset password
// 5  Change password
// 6  Resend verification code

router.post(
  "/register",
  validateRegisterFields,
  validPassword,
  async (req, res) => {
    try {
      await register(req, res);
    } catch (error) {
      internalServerError(res, error);
    }
  }
);

router.post("/login", validateLoginFields, validPassword, async (req, res) => {
  try {
    await login(req, res);
  } catch (error) {
    internalServerError(res, error);
  }
});

router.get("/token/verify", async (req, res) => {
  try {
    await verifyToken(req, res);
  } catch (error) {
    internalServerError(res, error);
  }
});

router.post(
  "/token/resend",
  validateLoginFields,
  validPassword,
  async (req, res) => {
    try {
      await resendToken(req, res);
    } catch (error) {
      internalServerError(res, error);
    }
  }
);

module.exports = router;
