# Node RESTful API

Asssignment for EGCO 427 Web programmming

## Start Service

```bash
    npm start
```

## How to generate RSA keypair

```bash
openssl genrsa -out privateKey.rsa 1024
openssl rsa -in key.rsa -pubout > publicKey.pub
```