const mongoose = require("mongoose");
const { TOKEN_COLLECTION } = require("../utils/constants").collections;

const tokenSchema = new mongoose.Schema({
  _userId: { type: mongoose.Schema.Types.ObjectId, required: true },
  token: { type: String, required: true },
  // tokens will expire after an hour
  // this will delete the document from collection when it is expired
  createdAt: {
    type: Date,
    required: true,
    default: Date.now,
    expires: 60 * 60,
  },
});

module.exports = mongoose.model(TOKEN_COLLECTION, tokenSchema);
