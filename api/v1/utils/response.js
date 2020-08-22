const { FAILED, INTERNAL_SERVER_ERROR } = require("./constants").errors;

// sends internal server error response
module.exports.internalServerError = (res, error) => {
  console.log(error);
  res.status(500).json({
    status: FAILED,
    message: INTERNAL_SERVER_ERROR,
    error: error,
  });
};
