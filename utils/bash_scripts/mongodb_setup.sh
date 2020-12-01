#!/bin/bash

echo "Installing MongoDB v4.4"

# get KEY from server and add it to system
wget -qO - https://www.mongodb.org/static/pgp/server-4.4.asc | sudo apt-key add -

# Create a list file for MongoDB
echo "deb [ arch=amd64,arm64 ] https://repo.mongodb.org/apt/ubuntu bionic/mongodb-org/4.4 multiverse" | sudo tee /etc/apt/sources.list.d/mongodb-org-4.4.list

# update apt components
sudo apt-get update

# install mongodb
sudo apt-get install -y mongodb-org

# Optional. Although you can specify any available version of MongoDB
echo "mongodb-org hold" | sudo dpkg --set-selections
echo "mongodb-org-server hold" | sudo dpkg --set-selections
echo "mongodb-org-shell hold" | sudo dpkg --set-selections
echo "mongodb-org-mongos hold" | sudo dpkg --set-selections
echo "mongodb-org-tools hold" | sudo dpkg --set-selections

# Configure mongodb
# Create a directory to store data
sudo mkdir /data
sudo mkdir /data/db

# Grant required permissions
sudo chown -R `id -un` /data/db

# start mongodb service
sudo service mongod start

# Check status of the service
sudo service mongod status
