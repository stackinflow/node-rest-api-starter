// sends internal server error response
module.exports.internalServerError = (res, error) => {
  console.log(error);
  res.status(500).json({
    status: "failed",
    message: "Internal server error",
    error: error,
  });
};
