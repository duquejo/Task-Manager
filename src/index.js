/**
 * 
 * 
 * Main Task App JS File
 * 
 * @requires express Server Management & REST API endpoints service
 * @requires nodemon Local development demon
 * @requires db/mongoose.js MongoDB Database Management CRUD / Model
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
const port  = process.env.PORT;

/**
 * Configure Express to automatically parse JSON as objects
 */
 app.use( express.json() );

 /**
  * Using custom route handlers
  */
 app.use( userRouter, taskRouter );
 
 app.listen( port, () => console.log( `Server is up on port ${ port }`) );

/**
 * Configure Express Middleware (Global)
 * 
 * @description Is used generally to make some Auth duties.
 */
// app.use( ( request, response, next ) =>{
//   /**
//    * We can have access to all request and response methods.
//    * We can Delimitate Middleware for HTTP Methods or more...
//    */
//   console.log( request.method, request.path );
//   next();
// });

/**
 * If we want to have a secure passwords it's recommended to encrypt it.
 * The NPM recommended library is bcrypt.
 */
// const bcrypt = require('bcryptjs');
// const jwt = require('jsonwebtoken');
// const myFunction = async () => {
  // const password = 'Red12345!*';
  /**
  * Hash password
  * @see 8 is the recommended param to pass the bcrypt hashing method.
  * @returns Promise
  */
  // const hashedPassword = await bcrypt.hash( password, 8 ); 
  // console.log( password, hashedPassword );
  /**
  * Check if the stored password is the same of the provided one
  */
  // const isMatch = await bcrypt.compare( 'Red12345!*', hashedPassword );
  // console.log( isMatch );

 /**
  * In every login problem, we need to keep a session active.
  * With Node JS, we can proceed to use JSON Web Tokens to manage it.
  * @see jsonwebtoken NPM library
  * 
  * It handles create, delete, renew methods.
  */
  /**
   * Using JWT
   * @param object Recommended to be a unique value stored in the database (Identifier)
   * @param string string to be used like encript (Signature)
   * @param options Ex. expiresIn Time to expirate the JWT Generated token
   */
  // const token = jwt.sign({ _id: 'abc123' }, process.env.JWT_SECRET, { expiresIn: '0 seconds' } );
  // console.log( token );
  // /**
  //  * To verify a token, provide it and pass the secret as second argument.
  //  */
  // const data = jwt.verify( token, process.env.JWT_SECRET );
  // console.log(data); 
// };
//  myFunction();

/**
 * Getting task owner data by reference
 */
// const Task = require('./models/task');
// const User = require('./models/user');

// const main = async () => {
//   // const task = await Task.findById( '614bf521649355515dab91d8' );

//   // await task.populate('owner'); // Find the user with the associated task.
//   // console.log( task.owner );

//   const user = await User.findById( '614bf458a0fd980ae3a3c2f5' );
//   await user.populate('tasks');
//   console.log( user.tasks );
// };
// main();


/**
 * Functionality for file uploads through NPM
 * @requires multer
 */
// const multer = require('multer');

/**
 * @param dest files folder destination
 * @param limits sets upload limits (size, etc.
 * @param fileFilter is used to filter request files by many params (like extension, and others)
 */
// const upload = multer({
//   dest: 'images',
//   limits: {
//     fileSize: 1000000
//   },
//   fileFilter( request, file, cBack ) {
    
//     // Restricting only for .word files.
//     if( !file.originalname.match( /\.(doc|docx)$/ ) ) {
//       return cBack( new Error('Please upload a Word document') );
//     }
//     cBack( undefined, true );
//   }
// });
// /**
//  * Is necessary to define the multer middleware inside route.
//  * @param upload.single value is the key for the request.
//  * 
//  * @see We can customize the error callback, providing a new one after the route call
//  */
// app.post( '/upload', upload.single('upload'), ( request, response ) => {
//   response.send();
// }, ( error, request, response, next ) => {
//   /**
//    * Custom Callback for error handling
//    */
//   response.status(400).send({ error: error.message });
// });

