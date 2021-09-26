/**
 * 
 * 
 * Main Task App Tests 
 * 
 * @requires express Server Management & REST API endpoints service
 * @requires nodemon Local development demon
 * @requires db/mongoose.js MongoDB Database Management CRUD / Model
 */


/**
 * Main App Index.js server config
 * @see Run 
 */

// Express Server
const express = require('express');

// Mongoose methods
require('./db/mongoose');

// Custom Routes
const userRouter = require('./routers/user');
const taskRouter = require('./routers/task');

/**
 * Express Settings
 */
const app   = express();

/**
 * Configure Express to automatically parse JSON as objects
 */
 app.use( express.json() );

 /**
  * Using custom route handlers
  */
 app.use( userRouter, taskRouter );

 module.exports = app;