#!/bin/bash

echo "------ Thank you for choosing node-rest-api-starter template -------"
echo "------ Setting up your node-project -------"
echo "------ Setting up your node-project -------"

cp .env.example .env

# generate keys
cd keys

echo "------ Generating private and public keys-------"
openssl genrsa -out private.pem 512
openssl rsa -in private.pem -outform PEM -pubout -out public.pem


openssl genrsa -out privater.pem 512
openssl rsa -in privater.pem -outform PEM -pubout -out publicr.pem


cd ..
npm install

echo "------ Please setup your project-------"

printf "Enter your project name: "
read -r pj_name

printf "Enter your github username: "
read -r gh_uname
#echo $pj_name

file=$(<package.json)
#echo $o_file
#file = sed -e "s/node-rest-api-starter/$pj_name/g" package.json
#file = sed -e "s/fayaz07/$gh_uname/g" file
#echo $file
file="${file//node-rest-api-starter/$pj_name}"
file="${file//fayaz07/$gh_uname}"
file="${file//Mohammad Fayaz/ }"
#echo $f1
echo $file > "package.json"

npm run format
echo "------ Your project has been setup, please star our repo if you like it. -------"