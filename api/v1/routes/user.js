const router = require("express").Router();
const { internalServerError } = require("../utils/response");
const {
  validateAccessToken,
  checkAccessToken,
  checkUserAccess,
} = require("../middlewares/auth");
const { getUser, updateUser } = require("../controllers/user");

router.get(
  "/",
  checkAccessToken,
  validateAccessToken,
  checkUserAccess,
  async (req, res) => {
    try {
      await getUser(req, res);
    } catch (error) {
      internalServerError(res, error);
    }
  }
);

router.patch(
  "/",
  checkAccessToken,
  validateAccessToken,
  checkUserAccess,
  async (req, res) => {
    try {
      await updateUser(req, res);
    } catch (error) {
      internalServerError(res, error);
    }
  }
);

module.exports = router;
