// importing app components
const express = require("express");
const app = express();
require("dotenv").config();

// this will have the environment and configuration for the application
const appConfig = require("./config");

console.log("Starting server...");

app.listen(appConfig.app.port, (err) => {
  if (err) {
    console.log(`Failed to listen on port ${appConfig.app.port}`);
    console.log(err);
  } else {
    console.log(`Listening on port ${appConfig.app.port}`);
    _printRunningEnvironment();
  }
});

// prints the environment the app is running currently along with the Local network IP
function _printRunningEnvironment() {
  // importing modules
  const os = require("os");
  const ifaces = os.networkInterfaces();

  let _lanIP;
  Object.keys(ifaces).forEach(function (ifname) {
    var alias = 0;

    ifaces[ifname].forEach(function (iface) {
      if ("IPv4" !== iface.family || iface.internal !== false) {
        // skip over internal (i.e. 127.0.0.1) and non-ipv4 addresses
        return;
      }

      if (alias >= 1) {
        // this single interface has multiple ipv4 addresses
        // console.log(ifname + ':' + alias, iface.address);
        _lanIP = iface.address;
      } else {
        // this interface has only one ipv4 adress
        // console.log(ifname, iface.address);
        _lanIP = iface.address;
      }
      ++alias;
    });
  });
  console.log(`App running on ${appConfig.name} environment`);
  console.log(
    `Run app on local machine http://127.0.0.1:${appConfig.app.port}`
  );
  console.log(
    `Run app over local network http://${_lanIP}:${appConfig.app.port}`
  );
}
