# 09 JEST - API Testing Basics with Supertest

This module demonstrates API testing setup using Jest and Supertest with an Express app.

## Existing Code Process

1. Basic server creation
- server.js imports src/app.js and starts on port 3000.

2. App route setup
- src/app.js defines:
  - GET /
  - POST /register

3. Validation middleware
- src/middlewares/validation.middleware.js defines register rules using express-validator.

4. Test creation
- src/test/_app.test.js sends request to GET / and checks response status/body.

## Essential Packages and Purpose

1. express
- API application framework.

2. jest
- Test runner and assertion framework.

3. supertest
- Sends HTTP requests to app during tests.

4. express-validator
- Request input validation.

## Environment Setup

No environment variables are currently required in this module.

## Current APIs

1. GET /
- Intended to return status 200 and { message: "Hello World" }.

2. POST /register
- Declared but not fully implemented.

## Running the Project and Tests

1. Install packages
- npm install

2. Run server
- npm run dev

3. Run tests
- npx jest

## Current Known Issues in Code

1. src/app.js uses res.send(200).json which is invalid.
- Should be res.status(200).json.

2. src/app.js has req.bdoy typo.
- Should be req.body.

3. POST /register does not return a response yet.

Fix these points first to make tests stable.
