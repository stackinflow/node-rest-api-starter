const checkIfEnvIsValid = require("./config").checkIfEnvIsValid;
const mongoose = require("mongoose");

function _getConnectionString(env) {
  if (!checkIfEnvIsValid(env)) {
    throw "Passed invalid environment";
  }

  // for hosts without a port
  // atlas clusters will not provide a port
  // only localhost will have a port
  // for localhost: mongodb://<username>:<password>@host/db-name
  // for remote host: mongodb+srv://<username>:<password>@host/db-name
  if (env.db.host.toString().includes("localhost")) {
    if (env.db.username === "" || env.db.password === "") {
      return `mongodb://${env.db.host}/${env.db.name}`;
    }
    return `mongodb://${env.db.username}:${env.db.password}@${env.db.host}/${env.db.name}`;
  }

  if (!env.db.port) {
    if (env.db.username === "" || env.db.password === "") {
      return `mongodb+srv://${env.db.host}/${env.db.name}`;
    }
    return `mongodb+srv://${env.db.username}:${env.db.password}@${env.db.host}/${env.db.name}`;
  } else {
    if (env.db.username === "" || env.db.password === "") {
      return `mongodb+srv://${env.db.host}:${env.db.port}/${env.db.name}`;
    }
    return `mongodb+srv://${env.db.username}:${env.db.password}@${env.db.host}:${env.db.port}/${env.db.name}`;
  }
}

module.exports.connectToDB = (appConfig) => {
  console.log("Connecting to db...");
  // console.log(_getConnectionString(appConfig));
  mongoose.connect(
    _getConnectionString(appConfig),
    {
      useUnifiedTopology: true,
      useNewUrlParser: true,
      useCreateIndex: true,
    },
    (error) => {
      if (error) {
        console.log("Unable to connect to db");
        console.error(error);
        process.exit(1);
      } else {
        console.log(`Connected to db ${appConfig.db.name} successfully`);
      }
    }
  );
};
