const router = require("express").Router();
const AuthMiddlewares = require("../middlewares/auth");
const AuthControllers = require("../controllers/auth");
const { internalServerError } = require("../utils/response");
const AccountConstants = require("../utils/constants").account;

/* user registration route
    - validate body
    - validate password
*/
router.post(
  "/register",
  AuthMiddlewares.validateRegisterFields,
  AuthMiddlewares.validPassword,
  async (req, res) => {
    try {
      await AuthControllers.registerWithEmail(
        req,
        res,
        AccountConstants.accRoles.normalUser
      );
    } catch (error) {
      internalServerError(res, error);
    }
  }
);

// TODO: if you want custom roles, add your custom register route and pass the role of that user
//
// Example: Register for role of DBA
//
// router.post(
//   "/dba/register",
//   AuthMiddlewares.validateRegisterFields,
//   AuthMiddlewares.validPassword,
//   async (req, res) => {
//     try {
//       await AuthControllers.registerWithEmail(
//         req,
//         res,
//         AccountConstants.accRoles.dba
//       );
//     } catch (error) {
//       internalServerError(res, error);
//     }
//   }
// );

/* user login route
    - validate body
    - validate password
*/
router.post(
  "/login",
  AuthMiddlewares.validateLoginFields,
  AuthMiddlewares.validPassword,
  async (req, res) => {
    try {
      await AuthControllers.loginWithEmail(req, res);
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
    await AuthControllers.verifyAccByToken(req, res);
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
  AuthMiddlewares.validateLoginFields,
  AuthMiddlewares.validPassword,
  async (req, res) => {
    try {
      await AuthControllers.resendAccVerificatinToken(req, res);
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
  AuthMiddlewares.checkAccessToken,
  AuthMiddlewares.validateAccessToken,
  AuthMiddlewares.validPasswords,
  AuthMiddlewares.checkUserAccess,
  async (req, res) => {
    try {
      await AuthControllers.updatePassword(req, res);
    } catch (error) {
      internalServerError(res, error);
    }
  }
);

/* sends an otp to email for resetting the password
    - validate email
*/
router.post(
  "/password/reset/code",
  AuthMiddlewares.validEmail,
  async (req, res) => {
    try {
      await AuthControllers.sendPasswordResetCode(req, res);
    } catch (error) {
      internalServerError(res, error);
    }
  }
);

/* sends an otp to email for resetting the password
    - validate email
*/
router.post(
  "/password/reset/code/resend",
  AuthMiddlewares.validEmail,
  async (req, res) => {
    try {
      await AuthControllers.resendPasswordResetCode(req, res);
    } catch (error) {
      internalServerError(res, error);
    }
  }
);

/* resets password
    - validate otp
    - validate passwords
*/
router.post(
  "/password/reset",
  AuthMiddlewares.validResetFields,
  AuthMiddlewares.validPassword,
  async (req, res) => {
    try {
      await AuthControllers.resetPassword(req, res);
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
  AuthMiddlewares.checkRefreshToken,
  AuthMiddlewares.validateRefreshToken,
  async (req, res) => {
    try {
      await AuthControllers.refreshTokens(req, res);
    } catch (error) {
      internalServerError(res, error);
    }
  }
);

/* deletes users' account
    - check if access-token is passed
    - validate access-token
*/
router.delete(
  "/",
  AuthMiddlewares.checkAccessToken,
  AuthMiddlewares.validateAccessToken,
  async (req, res) => {
    try {
      await AuthControllers.deleteAccount(req, res);
    } catch (error) {
      internalServerError(res, error);
    }
  }
);

/* login or register with facebook
    - check if oauth access-token is passed
*/
router.post(
  "/facebook",
  AuthMiddlewares.checkOAuthAccessToken,
  async (req, res) => {
    try {
      await AuthControllers.loginWithFB(req, res);
    } catch (error) {
      internalServerError(res, error);
    }
  }
);

/* login or register with google
    - check if oauth access-token is passed
*/
router.post(
  "/google",
  AuthMiddlewares.checkOAuthAccessToken,
  async (req, res) => {
    try {
      await AuthControllers.loginWithGoogle(req, res);
    } catch (error) {
      internalServerError(res, error);
    }
  }
);

module.exports = router;
