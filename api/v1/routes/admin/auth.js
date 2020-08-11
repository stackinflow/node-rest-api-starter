const router = require("express").Router();
const {
  validateRegisterFields,
  validPassword,
  checkAccessToken,
  validateAccessToken,
  checkAdmin,
} = require("../../middlewares/auth");
const {
  register,
  login,
  getAllUsers,
  getAllAdmins,
  enableUser,
  disableUser,
} = require("../../controllers/auth");
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

router.get(
  "/users",
  checkAccessToken,
  validateAccessToken,
  checkAdmin,
  async (req, res) => {
    try {
      await getAllUsers(res);
    } catch (error) {
      internalServerError(res, error);
    }
  }
);

router.get(
  "/admins",
  checkAccessToken,
  validateAccessToken,
  checkAdmin,
  async (req, res) => {
    try {
      await getAllAdmins(res);
    } catch (error) {
      internalServerError(res, error);
    }
  }
);

router.patch(
  "/user/disable",
  checkAccessToken,
  validateAccessToken,
  checkAdmin,
  async (req, res) => {
    try {
      await disableUser(req, res);
    } catch (error) {
      internalServerError(res, error);
    }
  }
);

router.patch(
  "/user/enable",
  checkAccessToken,
  validateAccessToken,
  checkAdmin,
  async (req, res) => {
    try {
      await enableUser(req, res);
    } catch (error) {
      internalServerError(res, error);
    }
  }
);

module.exports = router;
