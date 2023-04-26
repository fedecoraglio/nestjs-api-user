
## Description

A new company needs to address these requirements: Create a Node API with Typescript. Connect the Node API to MongoDB using mongoose (desirable models in typescript). We need to develop three endpoints behind a basic authentication (username and password). Create a user with name, last name, address, and profile picture (this should be a file). Retrieve users. Update user. Star point: Dockerize MongoDB and the Node API

## Installation

```bash
$ npm install
```

## Running the app locally

It is necessary to add an env variable .env at the root of the project like this:

```
db_uri=mongodb://localhost:27017/users-list
port=3000
jwt_secret=jwt_secret
jwt_expires= "7 days"
# it must be full path included the last / character. Ex: /user/home/
full_user_path_profile_img= /Users/federicocoraglio/Documents/development/projects/
# it is the server root access to images using the url. Ex. "/profile-images".
```
you can find an example on src/env/env.example

it is necessary to hash and instance of mongodb and update the connection on db_uri variable.

```bash
# development
$ npm run start
```

You can access to swagger documentation like this:http://localhost:3000/swagger

## Running the app using docker

It is necessary to create a .env file on the root of the project like this:

```
db_uri=mongodb://mongodb_2:27017/users-list
port=3001
jwt_secret=jwt_secret
jwt_expires=5d
full_user_path_profile_img= /app/
```

```bash
docker-compose up -d --build
```

You have to access to this link: http://localhost:3001/swagger

The email and password to login are:

```
email: "admin@test.com"
password: "12345678"
```

## License

Nest is [MIT licensed](LICENSE).
