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
