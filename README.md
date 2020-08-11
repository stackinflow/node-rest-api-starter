# Node.js REST API starter

<img src="https://raw.githubusercontent.com/stackinflow/node-rest-api-starter/master/assets/banner-node-rest-api.png">

This repository is a template to avoid rewriting all the basic authentication code for REST API's built with Express.js, MongoDB.

## Project architecture & Directories Structure

```
.
├── api
│   └── v1
│       ├── controllers
│       │   ├── auth.js
│       │   └── token.js
│       ├── middlewares
│       │   └── auth.js
│       ├── models
│       │   ├── auth.js
│       │   └── token.js
│       ├── routes
│       │   ├── admin
│       │   │   └── auth.js
│       │   └── auth.js
│       └── utils
│           ├── constants.js
│           ├── response.js
│           ├── send_email.js
│           ├── templates
│           │   └── verify_email.pug
│           └── validators.js
├── ASSET_LICENSES
├── core
│   ├── config.js
│   ├── db.js
│   ├── jwt.js
│   ├── print_env.js
│   └── server.js
├── index.js
├── keys
│   ├── private.pem
│   ├── private.pem.example
│   ├── privater.pem
│   ├── privater.pem.example
│   ├── public.pem
│   ├── public.pem.example
│   ├── publicr.pem
│   └── publicr.pem.example
├── LICENSE
├── node-rest-api-auth.postman_collection.json
├── package.json
├── package-lock.json
├── public
│   └── images
├── README.md
└── tests
    └── v1
        ├── auth.js
        └── test.js
```

## Tech stack

Node.js, MongoDB

### Dependencies

1. @hapi/joi: ^17.1.1
2. @sendgrid/mail: ^7.2.3
3. axios: ^0.19.2
4. bcryptjs: ^2.4.3
5. body-parser: ^1.19.0
6. cors: ^2.8.5
7. csurf: ^1.11.0
8. dotenv: ^8.2.0
9. express: ^4.17.1
10. express-brute: ^1.0.1
11. express-brute-memcached: 0.0.1
12. helmet: ^4.0.0
13. jsonwebtoken: ^8.5.1
14. mongoose: ^5.9.27
15. multer: ^1.4.2
16. nodemailer: ^6.4.11
17. otp-generator: ^1.1.0
18. pug: ^3.0.0
19. socket.io: ^2.3.0

### Dev dependencies

1. chai: ^4.2.0
2. chai-http: ^4.3.0
3. eslint: ^7.6.0
4. eslint-config-prettier: ^6.11.0
5. mocha: ^8.1.1
6. nodemon: ^2.0.4
7. prettier: ^2.0.5

### Tests

Tests are written using Mocha and Chai

### CI/CD

Not implemented yet

## Project setup

1. [Install and configure Node.js](#installation-of-nodejs)
2. [Mongodb Installation and Configuration](#mongodb-installation-configuration)
3. [Setup and Run the Project](#setup-and-run-the-project)

<!--
(#installation-of-nodejs)
-->

## Installation of Node.js

First thing we need to do is to install **nodejs**, you can find the installation steps and archives from the official website [here](https://nodejs.org/en/). It is recommended to use the LTS version of node to avoid any kind of interruptions.

#### Install specific version using CURL

1. Install `curl`

```bash
sudo apt update
sudo apt upgrade
sudo apt install curl
```

2. Get `nodejs` PPA
   Switch to root directory

```bash
cd ~
```

```bash
curl -sL https://deb.nodesource.com/setup_12.x -o nodesource_setup.sh
```

3. Run the script under sudo:

```bash
sudo bash nodesource_setup.sh
```

4. Install nodejs

```bash
sudo apt install nodejs
```

5. In order for some npm packages to work (those that require compiling code from source, for example), you will need to install the build-essential package:

```bash
sudo apt install build-essential
```

<!--
(#mongodb-installation-configuration)
-->

## Mongodb installation and configuration

In case you face any issues, refer official [docs](https://docs.mongodb.com/manual/tutorial/install-mongodb-on-ubuntu/)

#### Installing mongodb v4.2

a. Import the public key used by the package management system.

```bash
wget -qO - https://www.mongodb.org/static/pgp/server-4.2.asc | sudo apt-key add -
```

b. Create a list file for MongoDB

```bash
echo  "deb [ arch=amd64,arm64 ] https://repo.mongodb.org/apt/ubuntu bionic/mongodb-org/4.2 multiverse" | sudo tee /etc/apt/sources.list.d/mongodb-org-4.2.list
```

c. Reload local package database.

```bash
sudo apt-get update
```

d. Install the MongoDB packages

````bash
sudo apt-get install -y mongod
## Mongodb installation and configuration

In case you face any issues, refer official [docs](https://docs.mongodb.com/manual/tutorial/install-mongodb-on-ubuntu/)

#### Installing mongodb v4.2
a. Import the public key used by the package management system.
```bash
wget -qO - https://www.mongodb.org/static/pgp/server-4.2.asc | sudo apt-key add -
````

b. Create a list file for MongoDB

```bash
echo  "deb [ arch=amd64,arm64 ] https://repo.mongodb.org/apt/ubuntu bionic/mongodb-org/4.2 multiverse" | sudo tee /etc/apt/sources.list.d/mongodb-org-4.2.list
```

c. Reload local package database.

```bash
sudo apt-get update
```

d. Install the MongoDB packages

```bash
sudo apt-get install -y mongodb-org
```

e. Optional. Although you can specify any available version of MongoDB

```bash
echo  "mongodb-org hold" | sudo dpkg --set-selections
echo  "mongodb-org-server hold" | sudo dpkg --set-selections
echo  "mongodb-org-shell hold" | sudo dpkg --set-selections
echo  "mongodb-org-mongos hold" | sudo dpkg --set-selections
echo  "mongodb-org-tools hold" | sudo dpkg --set-selections
```

#### Configure mongodb

a. Create a directory to store data

```bash
sudo mkdir /data
sudo mkdir /data/db
```

b. Grant required permissions

```bash
sudo chown -R `id -un` /data/db
```

#### Start mongodb services

```bash
# start mongodb service
sudo service mongod start
# Check status of the service
sudo service mongod status
```

#### Initialize MongoDB

```bash
sudo mongod
```

The above command will start a `MongoDB` instance running on your local machine. I will pick a port to run the database, possibly it will be `27017`, so your db will be hosted at

```js
mongodb://localhost:27017/
```

#### MongoDB shell

Here you can execute your db queries. Initialize the shell by following command

```bash
mongo
```

<!--
(#setup-and-run-the-project)
-->

## Setup and run the project

1. Install the required dependencies by the following command

```bash
npm install
```

2. Setup public & private keys for `Access` and `Refresh` tokens
   Open your terminal and type the below commands to create secure private key and extracting public key from the private key.

Creating private key for access token

```bash
openssl genrsa -out private.pem 2048
```

Expected output:

```
Generating RSA private key, 2048 bit long modulus (2 primes)
....................................................+++++
.+++++
```

Extracting public key for access token

```bash
openssl rsa -in private.pem -outform PEM -pubout -out public.pem
```

Expected output:

```
writing RSA key
```

Creating private key for refresh token

```bash
openssl genrsa -out privater.pem 2048
```

Expected output:

```
Generating RSA private key, 2048 bit long modulus (2 primes)
....................................................+++++
.+++++
```

Extracting public key for refresh token

```bash
openssl rsa -in privater.pem -outform PEM -pubout -out publicr.pem
```

Expected output:

```
writing RSA key
```

and place these 4 files inside `keys` directory in root of the project
For more info on openssl, click [here](https://www.openssl.org/)

3. Setup environment variables
   Rename the `.env.example` as `.env` and fill up your details there.

**SendGrid**
Create an account at SendGrid [SendGrid](https://sendgrid.com/).
Create a new API Key [here](https://app.sendgrid.com/settings/api_keys)
Verify a sender email and use that email in the `.env` file, to verify click [here](https://app.sendgrid.com/settings/sender_auth/senders/new)

4. Place your application's Database credentials and config inside the `.env`.

Refer below config as example:

```js
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
```

5. Install [Prettier](https://marketplace.visualstudio.com/items?itemName=esbenp.prettier-vscode) and [ESLint](https://marketplace.visualstudio.com/items?itemName=dbaeumer.vscode-eslint) in VS Code

6. Run the project with nodemon

```bash
npm run dev
```

or Run as normal project

```bash
npm start
```

7. Run tests

```bash
npm test
```

## Features

1.  Authentication

## Authors

| ![image](https://avatars3.githubusercontent.com/u/35001172?s=128&v=4)                                                                                                                                                                                                                                                                                                                                                                         | ![image](https://avatars1.githubusercontent.com/u/20471162?s=128&v=4)                                                                                                                                                                                                                                                                                                                                                                                                                 |
| --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| [![LinkedIn](http://icons.iconarchive.com/icons/martz90/circle/32/linkedin-icon.png)](https://linkedin.com/in/fayaz07/) [![GitHub](https://icons.iconarchive.com/icons/artcore-illustrations/artcore-4/32/github-icon.png)](https://github.com/fayaz07/) [![Twitter](http://icons.iconarchive.com/icons/ampeross/smooth/32/Twitter-icon.png)](https://twitter.com/fayaz7_) [![Medium](public/images/medium.png)](https://medium.com/@fayaz07) | [![LinkedIn](http://icons.iconarchive.com/icons/martz90/circle/32/linkedin-icon.png)](https://linkedin.com/in/prudhvir3ddy/) [![GitHub](https://icons.iconarchive.com/icons/artcore-illustrations/artcore-4/32/github-icon.png)](https://github.com/prudhvir3ddy/) [![Twitter](http://icons.iconarchive.com/icons/ampeross/smooth/32/Twitter-icon.png)](https://twitter.com/https://twitter.com/prudhvir3ddy) [![Medium](public/images/medium.png)](https://medium.com/@prudhvir3ddy) |

## Contributing

Check [Contributing](CONTRIBUTING.md) file
