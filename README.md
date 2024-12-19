## Installation

Use the package manager [npm](https://www.npmjs.com/) to install 
Or use with yarn to install 

```bash
yarn install --save
```
or
```bash
npm install --save
```
## Set ENV
```bash
PORT = 
DB_TYPE = postgres
DB_PORT = 5432
DB_HOST = 
DB_NAME = 
DB_USERNAME = 
DB_PASS = 
JWT_SECRET = 
JWT_EXPIRES_IN =
```

## Run this app with yarn
```bash
npm run start:dev
```
or
```bash
yarn run start:dev
```

## Run a test
```bash
npm run start
```
or
```bash
yarn run start
```

## Explanation Api

- [POST] /auth/register 
```bash
{
    "email": "example@gmail.com",
    "password": "12345678",
    "fullname": "example",
    "gender": "male"
}
```
for register a new user

- [POST] /auth/login
```bash
{
    "email": "example@gmail.com",
    "password": "12345678"
}
```
for login a user

- [GET] /user
can get all user and not show user when already swipe in a day

- [GET] /user/:id
for get a user by id and for frontend or mobile can use this api to view user profile 

- [POST] /user/:id/swipes
```bash
{
    "swipe_type": "like" or "dislike"
}
```
for swipe a user

- [GET] /subscription
```bash
{
    "package": "unlimited_swipes" or ""
}
```
