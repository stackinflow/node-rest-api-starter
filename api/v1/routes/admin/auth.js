const router = require("express").Router();
const AuthMiddlewares = require("../../middlewares/auth");
const AuthControllers = require("../../controllers/auth");
const { internalServerError } = require("../../utils/response");
// const AccountConstants = require("../../utils/constants").account;

/* admin register route
    -  validates the body(email, password)
    -  check for password validity
*/
router.post(
  "/register",
  AuthMiddlewares.validateRegisterFields,
  AuthMiddlewares.validPassword,
  async (req, res) => {
    try {
      await AuthControllers.registerAsAdmin(req, res);
    } catch (error) {
      internalServerError(res, error);
    }
  }
);

/* admin login route
    - validates the body(email, password)
    - check for password validity
*/
router.post(
  "/login",
  AuthMiddlewares.validateLoginFields,
  AuthMiddlewares.validPassword,
  async (req, res) => {
    try {
      await AuthControllers.loginAsAdmin(req, res);
    } catch (error) {
      internalServerError(res, error);
    }
  }
);

/* returns a list of users registered in the app
    - validate access token
    - check if user is admin
*/
router.get(
  "/users",
  AuthMiddlewares.checkAccessToken,
  AuthMiddlewares.validateAccessToken,
  AuthMiddlewares.checkAdminAccess,
  async (req, res) => {
    try {
      await AuthControllers.getAllUsers(res);
    } catch (error) {
      internalServerError(res, error);
    }
  }
);

/* returns a list of admins registered in the app
    - validate access token
    - check if user is admin
*/
router.get(
  "/admins",
  AuthMiddlewares.checkAccessToken,
  AuthMiddlewares.validateAccessToken,
  AuthMiddlewares.checkAdminAccess,
  async (req, res) => {
    try {
      await AuthControllers.getAllAdmins(res);
    } catch (error) {
      internalServerError(res, error);
    }
  }
);

/* disables a user access in the application
    - validate access token
    - check if user is admin
*/
router.patch(
  "/user/disable",
  AuthMiddlewares.checkAccessToken,
  AuthMiddlewares.validateAccessToken,
  AuthMiddlewares.checkAdminAccess,
  async (req, res) => {
    try {
      await AuthControllers.disableUser(req, res);
    } catch (error) {
      internalServerError(res, error);
    }
  }
);

/* enables a user access in the application
    - validate access token
    - check if user is admin
*/
router.patch(
  "/user/enable",
  AuthMiddlewares.checkAccessToken,
  AuthMiddlewares.validateAccessToken,
  AuthMiddlewares.checkAdminAccess,
  async (req, res) => {
    try {
      await AuthControllers.enableUser(req, res);
    } catch (error) {
      internalServerError(res, error);
    }
  }
);

module.exports = router;
