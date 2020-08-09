const printEnvDetails = require("./print_env");
const helmet = require("helmet");
const bodyParser = require("body-parser");
const express = require("express");
const cors = require("cors");
const path = require("path");

// importing user routes
const authRoute = require("../api/v1/routes/auth");

// importing admin routes
const adminAuthRoute = require("../api/v1/routes/admin/auth");

function _configureServer(app) {
  console.log("Configuring server...");

  //  body parser
  app.use(express.json());
  //app.use(express.static(__dirname + '/docs'));
  app.use(express.static(path.join(__dirname, "../public")));
  app.use(helmet());

  app.use(bodyParser.json({ limit: "200kb" }));
  app.use(bodyParser.urlencoded({ extended: true }));

  // for website
  app.use(cors());

  console.log("Setting up request logging...");
  app.use((req, _, next) => {
    if (!req.url.includes("/uploads")) {
      console.log(
        `Req: ${req.method} ${req.url} ${new Date().toString()} ${
          req.connection.remoteAddress
        }`
      );
    }
    next();
  });

  _setRoutes(app);
}

function _setRoutes(app) {
  console.log("Setting up routes for api v1");
  //  auth middleware
  app.use("/api/v1/auth", authRoute);

  // admin routes
  // auth middleware
  app.use("/api/v1/admin/auth", adminAuthRoute);

  _handleInvalidRoutes(app);
}

function _handleInvalidRoutes(app) {
  // handling 404 routes
  /* eslint-disable no-alert, no-unused-vars, no-console */
  app.use(function (req, res, next) {
    res.status(404);

    // respond with html page
    if (req.accepts("html")) {
      res.send("<h2> 404 Not found</h2>");
      return;
    }

    // respond with json
    if (req.accepts("json")) {
      res.send({ error: "Route not found" });
      return;
    }

    // default to plain-text. send()
    res.type("txt").send("Route not found");
    return;
  });
}

module.exports.initServer = (app, appConfig) => {
  _configureServer(app);

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
