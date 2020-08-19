const checkIfEnvIsValid = require("./config").checkIfEnvIsValid;
const mongoose = require("mongoose");

// this method will return mongodb connection uri (string)
// based on the configuration
function _getConnectionString(env) {
  // just a basic check
  if (!checkIfEnvIsValid(env)) {
    throw "Passed invalid environment";
  }

  // for localhost: mongodb://<username>:<password>@host/db-name
  // only localhost will have a port
  // localhost dbs will not include srv
  if (env.db.host.toString().includes("localhost")) {
    if (env.db.username === "" || env.db.password === "") {
      return `mongodb://${env.db.host}:${env.db.port}/${env.db.name}`;
    }
    return `mongodb://${env.db.username}:${env.db.password}@${env.db.host}:${env.db.port}/${env.db.name}`;
  }

  // for remote host: mongodb+srv://<username>:<password>@host/db-name
  // atlas clusters will not provide a port or connect to default port 27017
  if (env.db.username === "" || env.db.password === "") {
    return `mongodb+srv://${env.db.host}/${env.db.name}`;
  }
  return `mongodb+srv://${env.db.username}:${env.db.password}@${env.db.host}/${env.db.name}`;
}

module.exports.connectToDB = (appConfig) => {
  console.log("Connecting to db...");
  // console.log(_getConnectionString(appConfig));

  // connecting to database here
  mongoose.connect(
    _getConnectionString(appConfig),
    {
      useUnifiedTopology: true,
      useNewUrlParser: true,
      useCreateIndex: true,
    },
    (error) => {
      // if connection was failed, then it prints out the error and exits
      if (error) {
        console.log("Unable to connect to db");
        console.error(error);
        process.exit(1);
      } else {
        // connection is successful prints out which db is connected to
        console.log(`Connected to db ${appConfig.db.name} successfully`);
      }
    }
  );
};
