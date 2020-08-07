const printEnvDetails = require("./print_env");

module.exports.initServer = (app, appConfig) => {
  console.log("Starting server...");

  app.listen(appConfig.app.port, (err) => {
    if (err) {
      console.log(`Failed to listen on port ${appConfig.app.port}`);
      console.error(err);
      process.exit(1);
    } else {
      console.log(`Listening on port ${appConfig.app.port}`);
      printEnvDetails(appConfig);
    }
  });
};
