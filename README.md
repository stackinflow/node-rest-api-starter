# Node.js REST API starter

<img src="https://raw.githubusercontent.com/stackinflow/node-rest-api-starter/master/assets/banner-node-rest-api.png">

[![stackinflow](https://img.shields.io/badge/stackinflow-opensource-brightgreen)](https://stackinflow.github.io/) [![Codacy Badge](https://api.codacy.com/project/badge/Grade/215290ffb548419bbff773ca8abcdb3d)](https://app.codacy.com/gh/stackinflow/node-rest-api-starter?utm_source=github.com&utm_medium=referral&utm_content=stackinflow/node-rest-api-starter&utm_campaign=Badge_Grade_Dashboard) [![Build Status](https://github.com/stackinflow/node-rest-api-starter/workflows/Mocha-Tests/badge.svg)](https://github.com/stackinflow/node-rest-api-starter/actions) [![GitHub issues](https://img.shields.io/github/issues/stackinflow/node-rest-api-starter)](https://github.com/stackinflow/node-rest-api-starter/issues) ![Twitter URL](https://img.shields.io/twitter/url?style=social&url=https%3A%2F%2Fgithub.com%2Fstackinflow%2Fnode-rest-api-starter) ![Gitter](https://img.shields.io/gitter/room/stackinflow/node-rest-api-starter) ![GitHub repo size](https://img.shields.io/github/repo-size/stackinflow/node-rest-api-starter) [![Created Badge](https://badges.pufler.dev/created/stackinflow/node-rest-api-starter)](https://badges.pufler.dev) [![Updated Badge](https://badges.pufler.dev/updated/stackinflow/node-rest-api-starter)](https://badges.pufler.dev)

<a href="https://www.buymeacoffee.com/fayaz" target="_blank"><img src="https://cdn.buymeacoffee.com/buttons/default-green.png" alt="Buy Me A Coffee" height="45px" width="180px" ></a>

This repository is a template to avoid rewriting all the basic authentication code for REST API's built with Express.js, MongoDB.

## Table of contents

1. [Why this template](#why-this-template)
2. [Project architecture and Directories Structure](#project-architecture-and-directories-structure)
3. [Tech stack](#tech-stack)
4. [Install and configure Node.js](#installation-of-nodejs)
5. [MongoDB installation and configuration](#mongodb-installation-and-configuration)
6. [Setup and Run the Project](#setup-and-run-the-project)
7. [Setup GitHub actions](#setup-github-actions)
8. [Authors](#authors)
9. [Contributing](#contributing)

<!--
(#why-this-template)
-->

## Why this template

- This repository includes setup of all basic things required to start a MEAN/MERN stack backend
- Environments setup
- Connection to database(MongoDB)
- Admin routes for handling users
- Authentication - fully handled
- Social auth includes Facebook and Google OAuth2 authorization
- Provides clean structured code
- Mocha Tests to ensure API is working
- Email templates for account verification and password reset
- Token based email verification and OTP based password reset
- Body field validators

<!--
(#project-architecture-and-directories-structure)
-->

## Project architecture and Directories Structure

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

<!--
(#tech-stack)
-->

## Tech stack

Node.js, MongoDB

### Dependencies

```
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
```

### Dev dependencies

```
1. chai: ^4.2.0
2. chai-http: ^4.3.0
3. eslint: ^7.6.0
4. eslint-config-prettier: ^6.11.0
5. mocha: ^8.1.1
6. nodemon: ^2.0.4
7. prettier: ^2.0.5
```

### Tests

Tests are written using Mocha and Chai

### CI/CD

Runs Tests on pull request is raised

## Project setup

Go ahead into the root directory of the repository and follow the below instructions

> Note: Setup scripts and docs are written only for `Ubuntu` based operating system, for other operating systems please refer to respective websites.

For manual setup docs, please refer here,

- [MongoDB](utils/docs/setup_mongo.md)
- [Node.js](utils/docs/setup_node.md)
- [Project & keys](utils/docs/setup_project.md)

<!--
(#installation-of-nodejs)
-->

## Installation of Node.js

Execute the below command in terminal

```bash
bash utils/bash_scripts/setup_node.sh
```

<!--
(#mongodb-installation-and-configuration)
-->

## MongoDB installation and configuration

Execute the below command in terminal

```bash
bash utils/bash_scripts/setup_mongo.sh
```

<!--
(#setup-and-run-the-project)
-->

## Setup and run the project

Execute the below command in terminal

```bash
bash utils/bash_scripts/setup_project.sh
```

1. Setup environment variables
   Rename the `.env.example` as `.env` and fill up your details there.

**SendGrid**
Create an account at SendGrid [SendGrid](https://sendgrid.com/).
Create a new API Key [here](https://app.sendgrid.com/settings/api_keys)
Verify a sender email and use that email in the `.env` file, to verify click [here](https://app.sendgrid.com/settings/sender_auth/senders/new)

2. Place your application's Database credentials and config inside the `.env`.

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

3. Install [Prettier](https://marketplace.visualstudio.com/items?itemName=esbenp.prettier-vscode) and [ESLint](https://marketplace.visualstudio.com/items?itemName=dbaeumer.vscode-eslint) in VS Code

4. Google and Facebook client details, [check out this article for generating client details](https://medium.com/@fayaz07/social-authentication-facebook-and-google-in-flutter-without-firebase-e3ca289ed50c)

5. Run the project with nodemon

```bash
npm run dev
```

or Run as normal project

```bash
npm start
```

6. Run tests

```bash
npm test
```

<!--
(#setup-github-actions)
-->

## Setup GitHub actions

Mock environment values

```bash
# allowed-values: prod, dev, test
NODE_ENV=dev
PORT=5000

# mongodb
# Ex: remote mongodb host: my-app.xxxxx.mongodb.net
DB_NAME=node_template
DB_HOST=localhost
DB_PORT=27017
DB_USERNAME=
DB_PASSWORD=

# tokens
TOKEN_ISSUER=Node.js
TOKEN_AUDIENCE=API_USERS
TOKEN_SUBJECT=API_ACCESS
# Ex: For 1 day- 1d, for 1 second - 1s
REFRESH_TOKEN_EXPIRES=
ACCESS_TOKEN_EXPIRES=

# host
# for remote host=https://myapp.com
host=localhost:5000

# SENDGRID_API_KEY go here
SENDGRID_API_KEY=<API-KEY>
SENDGRID_EMAIL=john@doe.com
SENDGRID_USERNAME=John

# facebook client details
client_id=
client_secret=
```

Create such config locally in a text file or just copy the config from `.env` of your db, then head over to `Secrets` section of your repo, an ideal link would be like this https://github.com/username/node-rest-api-starter/settings/secrets when you replace `username` with your own github username, then create a new Secret there with key as `ENV_VARS_LOCALHOST` and the value as whole of your file which you have just created in the above step. When you make a pull request to the master branch this will get executed.

<!--
(#authors)
-->

## Authors

| ![image](https://avatars3.githubusercontent.com/u/35001172?s=128&v=4)                                                                                                                                                                                                                                                                                                                                                                         | ![image](https://avatars1.githubusercontent.com/u/20471162?s=128&v=4)                                                                                                                                                                                                                                                                                                                                                                                                                 |
| --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| [![LinkedIn](http://icons.iconarchive.com/icons/martz90/circle/32/linkedin-icon.png)](https://linkedin.com/in/fayaz07/) [![GitHub](https://icons.iconarchive.com/icons/artcore-illustrations/artcore-4/32/github-icon.png)](https://github.com/fayaz07/) [![Twitter](http://icons.iconarchive.com/icons/ampeross/smooth/32/Twitter-icon.png)](https://twitter.com/fayaz7_) [![Medium](public/images/medium.png)](https://medium.com/@fayaz07) | [![LinkedIn](http://icons.iconarchive.com/icons/martz90/circle/32/linkedin-icon.png)](https://linkedin.com/in/prudhvir3ddy/) [![GitHub](https://icons.iconarchive.com/icons/artcore-illustrations/artcore-4/32/github-icon.png)](https://github.com/prudhvir3ddy/) [![Twitter](http://icons.iconarchive.com/icons/ampeross/smooth/32/Twitter-icon.png)](https://twitter.com/https://twitter.com/prudhvir3ddy) [![Medium](public/images/medium.png)](https://medium.com/@prudhvir3ddy) |

<!--
(#contributing)
-->

## Contributing

Check [Contributing](utils/CONTRIBUTING.md) file
