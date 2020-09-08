const mongoose = require("mongoose");
const { USER_COLLECTION } = require("../utils/constants").collections;

const userSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      unique: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    username: {
      type: String,
      unique: true,
    },
    firstName: String,
    lastName: String,
    gender: String,
    age: Number,
    knownLanguages: {
      type: String,
    },
    profession: String,
    location: Object,
    latitude: Number,
    longitude: Number,
    photoUrl: String,
    symptoms: String,
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model(USER_COLLECTION, userSchema);
