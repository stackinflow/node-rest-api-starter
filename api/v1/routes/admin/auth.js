const router = require("express").Router();
const {
  validateRegisterFields,
  validPassword,
} = require("../../middlewares/auth");
const { register, login } = require("../../controllers/auth");
const { internalServerError } = require("../../utils/response");

router.post(
  "/register",
  validateRegisterFields,
  validPassword,
  async (req, res) => {
    try {
      await register(req, res, true);
    } catch (error) {
      internalServerError(res, error);
    }
  }
);

router.post(
  "/login",
  validateRegisterFields,
  validPassword,
  async (req, res) => {
    try {
      await login(req, res, true);
    } catch (error) {
      internalServerError(res, error);
    }
  }
);

module.exports = router;
