<!--
(#setup-and-run-the-project)
-->

## Setup and run the project

1. Install the required dependencies by the following command

```bash
npm install
```

2. Setup public & private keys for `Access` and `Refresh` tokens
   Open your terminal and type the below commands to create secure private key and extracting public key from the private key. We're using a 512 bit long key, as the length increases the size of jwt also increases.

Creating private key for access token

```bash
openssl genrsa -out private.pem 512
```

Expected output:

```
Generating RSA private key, 512 bit long modulus (2 primes)
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
openssl genrsa -out privater.pem 512
```

Expected output:

```
Generating RSA private key, 512 bit long modulus (2 primes)
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
