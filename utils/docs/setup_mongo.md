<!--
(#mongodb-installation-and-configuration)
-->

## MongoDB installation and configuration

In case you face any issues, refer official [docs](https://docs.mongodb.com/manual/tutorial/install-mongodb-on-ubuntu/)

#### Installing mongodb v4.4

a. Import the public key used by the package management system.

```bash
wget -qO - https://www.mongodb.org/static/pgp/server-4.4.asc | sudo apt-key add -
```

b. Create a list file for MongoDB

```bash
echo "deb [ arch=amd64,arm64 ] https://repo.mongodb.org/apt/ubuntu bionic/mongodb-org/4.4 multiverse" | sudo tee /etc/apt/sources.list.d/mongodb-org-4.4.list
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
echo "mongodb-org hold" | sudo dpkg --set-selections
echo "mongodb-org-server hold" | sudo dpkg --set-selections
echo "mongodb-org-shell hold" | sudo dpkg --set-selections
echo "mongodb-org-mongos hold" | sudo dpkg --set-selections
echo "mongodb-org-tools hold" | sudo dpkg --set-selections
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
