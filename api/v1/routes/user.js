const router = require("express").Router();
const { internalServerError } = require("../utils/response");
const AuthMiddlewares = require("../middlewares/auth");
const UserControllers = require("../controllers/user");

router.get(
  "/",
  AuthMiddlewares.checkAccessToken,
  AuthMiddlewares.validateAccessToken,
  AuthMiddlewares.checkUserAccess,
  async (req, res) => {
    try {
      await UserControllers.getUser(req, res);
    } catch (error) {
      internalServerError(res, error);
    }
  }
);

router.patch(
  "/",
  AuthMiddlewares.checkAccessToken,
  AuthMiddlewares.validateAccessToken,
  AuthMiddlewares.checkUserAccess,
  async (req, res) => {
    try {
      await UserControllers.updateUser(req, res);
    } catch (error) {
      internalServerError(res, error);
    }
  }
);

router.get(
  "/check/:username",
  AuthMiddlewares.checkAccessToken,
  AuthMiddlewares.validateAccessToken,
  AuthMiddlewares.checkUserAccess,
  AuthMiddlewares.checkUsername,
  async (req, res) => {
    try {
      await UserControllers.checkUsernameAvailability(req, res);
    } catch (error) {
      internalServerError(res, error);
    }
  }
);

module.exports = router;
