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
