#!/bin/bash

echo "Installing Node.js v12"
# update apt components
sudo apt update

# Install curl
sudo apt install curl

# Get nodejs PPA Switch to root directory
cd ~
curl -sL https://deb.nodesource.com/setup_12.x -o nodesource_setup.sh

# Run the script under sudo
sudo bash nodesource_setup.sh

# Install nodejs
sudo apt install -y nodejs

# In order for some npm packages to work
# (those that require compiling code from source, for example), 
# you will need to install the build-essential package:
sudo apt install -y build-essential
