/**
 * 
 * 
 * Main Task App JS File
 * @description Run this file for dev/production purposes. If you need to run
 * test cases, run app.js.
 * 
 * @requires express Server Management & REST API endpoints service
 * @requires nodemon Local development demon
 * @requires db/mongoose.js MongoDB Database Management CRUD / Model
 */

const app = require("./app");

/**
 * App port
 */
const port  = process.env.PORT;

/**
 * Listening function
 */
 app.listen( port, () => console.log( `Server is up on port ${ port }`) );