const User = require("../models/user");
const Errors = require("../utils/constants").errors;
const Success = require("../utils/constants").successMessages;
const crypto = require("crypto");

module.exports.createUser = async (userData) => {
  var user = new User({
    userId: userData._id,
    email: userData.email,
    username:
      userData.firstName.toString().toLowerCase() +
      "_" +
      crypto.randomBytes(3).toString("hex"),
    firstName: userData.firstName,
    lastName: userData.lastName,
    photoUrl: userData.photoUrl,
  });
  await user.save();
};

module.exports.getUser = async (req, res) => {
  await User.findOne(
    { userId: req.tokenData.authId },
    {
      _id: 0,
      createdAt: 0,
      updatedAt: 0,
      __v: 0,
    },
    (error, user) => {
      if (error || !user) {
        return res.status(403).json({
          status: Errors.FAILED,
          message: Errors.USER_NOT_EXISTS,
        });
      }
      return res.status(200).json({
        status: Success.SUCCESS,
        message: Success.FETCHED_USER_DATA,
        user: user,
      });
    }
  );
};

module.exports.updateUser = async (req, res) => {
  var user = await User.findOne(
    { userId: req.tokenData.authId },
    {
      createdAt: 0,
      updatedAt: 0,
      __v: 0,
    }
  );
  user = _updateUserModel(user, req.body);
  await user.save((error, updated) => {
    if (error || !updated)
      return res.status(403).json({
        status: Errors.FAILED,
        message: Errors.USER_DATA_UPDATE_FAILED,
      });
    return res.status(200).json({
      status: Success.SUCCESS,
      message: Success.UPDATED_USER_DATA,
      user: updated,
    });
  });
};

module.exports.checkUsernameAvailability = async (req, res) => {
  const user = await User.findOne(
    { username: req.params.username },
    { _id: 1 }
  );
  if (user) {
    return res.status(409).json({
      status: Errors.FAILED,
      message: Errors.USERNAME_IN_USE,
    });
  } else {
    return res.status(200).json({
      status: Success.SUCCESS,
      message: Success.USERNAME_AVAILABLE,
    });
  }
};

module.exports.deleteUser = async (authId) => {
  await User.deleteOne({ userId: authId });
};

function _updateUserModel(userData, updated) {
  for (const [key, value] of Object.entries(updated)) {
    if (value && _isAllowed(key)) {
      userData[key] = updated[key];
    }
  }

  return userData;
}

const _immutableFields = [
  "email",
  "userId",
  "_id",
  "__v",
  "createdAt",
  "updatedAt",
];

function _isAllowed(key) {
  return !_immutableFields.includes(key);
}

module.exports.fetchNameOfUser = async function (email) {
  var name = " ";
  await User.findOne({ email: email }, { firstName: 1, lastName: 1 })
    .then((document) => {
      if (!document) {
        name = " ";
      }
      name = document.firstName + " " + document.lastName;
    })
    .catch((err) => {
      console.log(err);
      name = " ";
    });
  return name;
};
