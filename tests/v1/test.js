require("dotenv").config();
process.env.NODE_ENV = "test";

const chai = require("chai");
const chaiHttp = require("chai-http");
const server = require("../../index").server;
const mongoose = require("mongoose");

chai.should();
chai.use(chaiHttp);

// because they come with mocha in command line
/*global before, describe*/
/*eslint no-undef: "error"*/
before(function () {
  return new Promise((resolve, reject) => {
    mongoose.connection.once("open", async function () {
      // All OK - fire (emit) a ready event.
      console.log("Connected to MongoDB");
      return resolve();
    });

    mongoose.connection.once("close", function () {
      console.log("Connected to MongoDB failed");
      return reject();
    });
  });
});

function importTest(path) {
  require(path)(chai, server);
}

describe("Testing api v1", () => {
  importTest("./auth");
});
