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
│   └── v1
│       ├── controllers
│       │   ├── auth.js
│       │   ├── token.js
│       │   └── user.js
│       ├── middlewares
│       │   └── auth.js
│       ├── models
│       │   ├── auth.js
│       │   ├── token.js
│       │   └── user.js
│       ├── routes
│       │   ├── admin
│       │   │   └── auth.js
│       │   ├── auth.js
│       │   └── user.js
│       └── utils
│           ├── constants
│           │   ├── account.js
│           │   ├── collection_names.js
│           │   ├── email_token.js
│           │   ├── error_messages.js
│           │   ├── headers.js
│           │   └── success_messages.js
│           ├── constants.js
│           ├── response.js
│           ├── send_email.js
│           ├── templates
│           │   └── verify_email.pug
│           └── validators.js
├── assets
│   └── banner-node-rest-api.png
├── core
│   ├── config.js
│   ├── db.js
│   ├── helpers.js
│   ├── jwt.js
│   ├── print_env.js
│   └── server.js
├── index.js
├── keys
│   ├── private.pem
│   ├── privater.pem
│   ├── public.pem
│   └── publicr.pem
├── package.json
├── package-lock.json
├── public
│   └── images
├── README.md
├── tests
│   └── v1
│       ├── auth.js
│       └── test.js
└── utils
    ├── ASSET_LICENSES
    ├── bash_scripts
    │   ├── mongodb_setup.sh
    │   ├── node_setup.sh
    │   └── setup_project.sh
    ├── CONTRIBUTING.md
    ├── docs
    │   ├── gh_actions.md
    │   ├── setup_mongo.md
    │   ├── setup_node.md
    │   └── setup_project.md
    ├── node-rest-api-auth.postman_collection.json
    └── swagger
        ├── api
        │   └── v1
        │       ├── auths.yaml
        │       └── paths.yaml
        ├── schemas
        └── swagger.yaml
```

<!--
(#tech-stack)
-->

## Tech stack

Node.js, Express.js, MongoDB, JWT, Pug.js, Sendgrid mail

### Dependencies

Check [`package.json`](package.json) file

### Tests

Tests are written using Mocha and Chai, [here](./tests/v1)

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

3. Install [Prettier](https://marketplace.visualstudio.com/items?itemName=esbenp.prettier-vscode) and [ESLint](https://marketplace.visualstudio.com/items?itemName=dbaeumer.vscode-eslint) in VS Code

4. Google and Facebook client details, [check out this article for generating client details](https://medium.com/@fayaz07/social-authentication-facebook-and-google-in-flutter-without-firebase-e3ca289ed50c)

5. Run the project with nodemon (dev server)

```bash
npm run dev
```

or Run as normal project (prod server)

```bash
npm start
```

6. Run tests

```bash
npm test
```

After running the project, checkout swagger ui at [http://localhost:7000/explorer/#/](http://localhost:7000/explorer/#/)

<!--
(#setup-github-actions)
-->

## Setup GitHub actions

Refer this [page](utils/docs/gh_actions.md)

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
