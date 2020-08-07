require("dotenv").config();

const dev = {
  name: "dev",
  app: {
    port: process.env.PORT || 9000,
  },
  db: {
    name: `${process.env.DB_NAME}-dev`,
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    username: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD,
  },
};

const test = {
  name: "test",
  app: {
    port: process.env.PORT || 9000,
  },
  db: {
    name: `${process.env.DB_NAME}-test`,
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    username: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD,
  },
};

const prod = {
  name: "prod",
  app: {
    port: process.env.PORT || 9000,
  },
  db: {
    name: `${process.env.DB_NAME}`,
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    username: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD,
  },
};

const config = {
  dev,
  test,
  prod,
};

// 'dev' or 'test' or 'prod'
const env = _getEnvironment();

function _getEnvironment() {
  const tEnv = process.env.NODE_ENV;
  if (tEnv == "prod" || tEnv == "dev" || tEnv == "test") return tEnv;
  console.log(
    "Warning: Invalid environment config in .env for key NODE_ENV\nPicking dev environment for running server"
  );
  return "dev";
}

function _checkIfEnvIsValid(env) {
  if (!env || !env.db || !env.db.host || !env.db.name) {
    return false;
  }
  return true;
}

function getConnectionString(env) {
  if (!_checkIfEnvIsValid(env)) {
    throw "Passed invalid environment";
  }

  // for hosts without a port
  // atlas clusters will not provide a port
  // only localhost will have a port
  // mongodb+srv://<username>:<password>@host/db-name
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

module.exports = config[env] || config["dev"];
module.exports.dbConn = getConnectionString;
