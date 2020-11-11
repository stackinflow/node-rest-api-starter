const router = require("express").Router();
const {
  validateRegisterFields,
  validPassword,
  checkAccessToken,
  validateAccessToken,
  checkAdminAccess,
} = require("../../middlewares/auth");
const {
  registerWithEmail,
  loginWithEmail,
  getAllUsers,
  getAllAdmins,
  enableUser,
  disableUser,
} = require("../../controllers/auth");
const { internalServerError } = require("../../utils/response");

/* admin register route
    -  validates the body(email, password)
    -  check for password validity
*/
router.post(
  "/register",
  validateRegisterFields,
  validPassword,
  async (req, res) => {
    try {
      await registerWithEmail(req, res, true);
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
  validateRegisterFields,
  validPassword,
  async (req, res) => {
    try {
      await loginWithEmail(req, res, true);
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
  checkAccessToken,
  validateAccessToken,
  checkAdminAccess,
  async (req, res) => {
    try {
      await getAllUsers(res);
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
  checkAccessToken,
  validateAccessToken,
  checkAdminAccess,
  async (req, res) => {
    try {
      await getAllAdmins(res);
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
  checkAccessToken,
  validateAccessToken,
  checkAdminAccess,
  async (req, res) => {
    try {
      await disableUser(req, res);
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
  checkAccessToken,
  validateAccessToken,
  checkAdminAccess,
  async (req, res) => {
    try {
      await enableUser(req, res);
    } catch (error) {
      internalServerError(res, error);
    }
  }
);

module.exports = router;
