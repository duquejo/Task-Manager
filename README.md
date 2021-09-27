# BootCamp Node JS (Ceiba - Globant)
### Welcome to the Task Manager App!

[![made-with-javascript](https://img.shields.io/badge/Made%20with-JavaScript-1f425f.svg)](https://www.javascript.com)
[![made-with-nodejs](https://img.shields.io/badge/Made_with-Node_JS-green.svg)](https://nodejs.org/es/)

## Tech

- *Task Manager App*: Node JS Task Manager App using live endpoints, REST API Structure and a MongoDB Database Model.
  - *Dependencies*
    - Express (4.17.1): Server management module.
    - MongoDB (4.1.2): Generate MongoDB Support, connections, and more.
    - Mongoose (6.0.5): Manages database model sanitization and validation, also makes the MongoDB database general operations.
    - Validator (13.6.0): Allows backend to manage complex validations.
    - JsonWebToken (8.5.1): Manages user sessions (Login).
    - Bcryptjs (2.4.3): Encrypt passwords securely.
    - Multer (1.4.3): Manages file uploading.
    - Mailgun-JS (0.22.0): Email Messaging Service.
    - Sharp (0.29.1): Image manipulation and optimization library.
  - *Dev Dependencies*
    - Env-cmd: (10.1.0): Enviroment variables management.
    - Jest: (27.2.2): Node JS Testing suite with mocking support.
    - Nodemon (2.0.12): Listens any JS (or whatever) file changes.
    - Supertest: (6.1.6): Improves Jest with asyncronous tasks and HTTP Request testing support.
  - [Task Manager App Git](https://github.com/duquejo01/Task-Manager): GIT Source.
  - [Task Manager App Demo](https://duque-task-manager.herokuapp.com/): Live Task Manager App Public Demo.

## Bootcamp Index

Click on the following [link](https://github.com/duquejo01/BootCamp-Node-JS) to return back the Index.

## Commands

Use the following command into console to run automatically nodemon scripts listening. It only works in your local machine.
```sh
npm run dev
```

## Configure ENV module like this
```sh
  ...
  "scripts": {
    "start": "node src/index.js",
    "dev": "env-cmd ./config/dev.env nodemon src/index.js"
  },
  ...
```

## Serving Heroku project
```sh
heroku config:set key=value
```
then: (To check all conf values)
```sh
heroku config
```