const User = require("../models/user");
const {
  FAILED,
  USER_NOT_EXISTS,
  USER_DATA_UPDATE_FAILED,
} = require("../utils/constants").errors;
const {
  SUCCESS,
  FETCHED_USER_DATA,
  UPDATED_USER_DATA,
} = require("../utils/constants").successMessages;
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
  await User.findById(
    req.tokenData.authId,
    {
      _id: 0,
      createdAt: 0,
      updatedAt: 0,
      __v: 0,
    },
    (error, user) => {
      if (error) {
        return res.status(403).json({
          status: FAILED,
          message: USER_NOT_EXISTS,
        });
      }
      return res.status(200).json({
        status: SUCCESS,
        message: FETCHED_USER_DATA,
        user: user,
      });
    }
  );
};

module.exports.updateUser = async (req, res) => {
  var user = await User.findById(req.tokenData.authId, {
    createdAt: 0,
    updatedAt: 0,
    __v: 0,
  });
  user = _updateUserModel(user, req.body);
  await user.save((error, updated) => {
    if (error)
      return res.status(403).json({
        status: FAILED,
        message: USER_DATA_UPDATE_FAILED,
      });
    return res.status(200).json({
      status: SUCCESS,
      message: UPDATED_USER_DATA,
      user: updated,
    });
  });
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
  await User.findOne({ email: email }, { firstName: 1, lastName: 1 })
    .then((document) => {
      if (!document) {
        return " ";
      }
      return document.firstName + " " + document.lastName;
    })
    .catch((err) => {
      console.log(err);
      return " ";
    });
};
