/**
 * User Separated Routes
 * 
 * @requires express
 * @requires User Mongoose Model
 * @requires router Express Route
 * @requires auth Custom User Auth Middleware
 * @requires multer Multipart/form-data file uploads support
 * @requires sharp Image Optimization Library
 */
const express = require('express');
const User = require('../models/user');
const auth = require('../middleware/auth');
const multer = require('multer');
const sharp = require('sharp');
const { sendWelcomeEmail, sendCancelationEmail } = require('../emails/account');
const router = new express.Router();

/**
 * Creating a separated router
 * @see That's ideal for have a more organized project
 * 
 * @step1 Instanciate a new Express Router
 * @step2 Define Custom routes
 * @step3 Make the new routes as part of express app structure.
 */

/**
 * Create an user
 */
router.post( '/users', async ( request, response ) => {

  /**
   * User Insertion
   */
   const user = new User( request.body );

  try{
    await user.save();

    /**
     * Sending Welcome Automation
     */
    // sendWelcomeEmail( user.email, user.name );

    /**
     * Generating JWT session tokens
     */
    const token = await user.generateAuthToken();
    response.status(201).send( { user, token } );

  }catch( e ){
    response.status(400).send( e );
  }

  // /**
  //  * User Insertion
  //  */
  // const user = new User( request.body );
  // user.save().then( () => {
  //   /**
  //    * @see In express, the default status code is 200
  //    */
  //   response.send( user );
  // }).catch( error => {
  //   /**
  //    * Setting Status Code
  //    * @see Chaining is available
  //    */
  //   response.status(400).send(error);
  // });  
});

/**
 * Get all users *disabled*
 * @requires auth middleware as second arg
 */
router.get( '/users', auth, async ( request, response ) => {

  // All users stored in database

  // Callback pattern version
  // User.find({}).then( users => {
  //   response.send(users);
  // }).catch( e => {
  //   response.status(500).send();
  // });

  // ES6 Version6
  // try {
  //   const users = await User.find({});
  //   response.send(users);
  // } catch (e) {
  //   response.status(500).send();
  // }

  response.status(404).send('Cannot access to /users route');
  
});

/**
 * Logout current User session
 */
router.post( '/users/logout', auth, async ( request, response ) => {
  try {
    /**
     * Filtering current user tokens to remove the actual token generated in session
     * That's used when the user initializes many sessions in differents devices and
     * we don't need to remove all of them.
     */
    request.user.tokens = request.user.tokens.filter( token => token.token !== request.token );
    await request.user.save();

    response.send();

  } catch (e) {
    response.status(500).send();
  }
});

/**
 * Challenge Logout all user sessions
 */
router.post( '/users/logoutAll', auth, async ( request, response ) => {
  try {

    request.user.tokens = [];
    await request.user.save();

    response.send();

  } catch (e) {
    response.status(500).send();
  }
});

/**
 * Get current user profile
 * this route only works if the user is logged and authenticated
 * @requires auth middleware
 */
router.get( '/users/me', auth, async ( request, response ) => {
  response.send( request.user );
});

/**
 * Express dynamic routes
 * Get user by ObjectId
 * @see Add :name to add a dynamic parameter
 */
router.get('/users/:id', async ( request, response ) => {

// const _id = request.params.id;
// User.findById( _id ).then( user => {
// console.log( user );
//   if ( ! user ) return response.status(404).send();
//   response.send( user );
// })
// .catch( e => {
//   // Bugfix cast error
//   if( e.name == 'CastError' ) return response.status(400).send('Invalid ID');
//   response.status(500).send()
// });

const _id = request.params.id;
try{
  const user = await User.findById( _id );
  if( ! user ) return response.status(404).send();
  response.send( user );
} catch ( e ){
  if( e.name = 'CastError' ) return response.status(400).send( 'Invalid ID' ); // Bugfix ObjectId Cast Error
  response.status(500).send();
}
});

/**
 * 
 * 
 * Resource Routes
 * 
 * 
 */

/**
 * Patch Method to Update an User.
 * @param _id ObjectId
 * @param Object User Object to update. (Without ObjectId )
 */
router.patch( '/users/me', auth, async ( request, response ) => {

  /**
   * We need to check all params to enable user patching
   * That's because it allow update the user with unknown keys if we don't define it.
   */
  const updates        = Object.keys( request.body ); 
  const allowedUpdates = [ 'name', 'email', 'password', 'age' ];

  /**
   * Check every array value and validates it.
   */
  const isValidOperation = updates.every( update => allowedUpdates.includes( update ) );

  if( ! isValidOperation ) return response.status(400).send( { error: 'Invalid updates' });

  try {

    /**
     * Update Options:
     * @param new: returns if new user exists.
     * @param runValidators: returns validations if catch call.
     */
    /**
     * @see Edited!
     * Setting Password Model Middleware because it needs to be attached when 'save' function is called
     */
    // // Old way - direct query
    // // const user = await User.findByIdAndUpdate( request.params.id, request.body, { new: true, runValidators: true } );    
    // const user = await User.findById( request.params.id );
    // // Assign one by one
    // updates.map( update => user[update] = request.body[update] );
    // Save
    // await user.save();
    // if( ! user ) return response.status( 404 ).send(); 
    // response.send( user );  

    // Assign one by one
    updates.map( update => request.user[update] = request.body[update] );
    // Save
    await request.user.save();
    response.send( request.user );
    
  } catch (e) {
    response.status(400).send(e);
  }
});

/**
 * Delete user by ObjectId
 * @see Added Auth Middleware
 */
 router.delete( '/users/me', auth, async ( request, response ) => {
  try {
    

    await request.user.remove(); // Mongoose Method to remove.
    
    /**
     * Sending Welcome Automation
     */
    sendCancelationEmail( request.user.email, request.user.name );

    response.send( request.user );

    // const user = await User.findByIdAndDelete( request.params.id );
    // if( ! user ) return response.status(404).send();    
  } catch (e) {
    response.status(500).send();
  }
});


/**
 * *************
 * Log in Module
 * *************
 * 
 */

/**
 * Login Route
 */
router.post( '/users/login', async ( request, response ) => {
  try {
    // Define custom User Model function to login
    const user  = await User.findByCredentials( request.body.email, request.body.password );
    const token = await user.generateAuthToken();

    /**
     * Security added
     * @see Now the sensitive data like passwords and tokens are securely hidden in the request.
     * @method getPublicProfile User Model ( user: user.getPublicProfile() )
     */
    response.send( { user, token } );
  } catch (e) {
    response.status(400).send(e);
  }
});


/**
 * Challenge: Setup endpoint for avatar upload.
 */
const upload = multer({ 
  // dest: 'avatars', // if we disable that, the file will be received in the request.
  limits: {
    fileSize: 1000000
  },
  fileFilter( request, file, callBack ) {
    // Allow only jpg, jpeg and png images.
    if( ! file.originalname.match( /\.(jpg|jpeg|png)$/ ) ){
      callBack( new Error( 'File extension not valid, only jpg, jpeg, png extensions are allowed') );
    }
    callBack( undefined, true );
  }
});

/**
 * Avatar upload route
 */
router.post( '/users/me/avatar', auth, upload.single( 'avatar' ), async ( request, response ) => {

  // // First disable destination from multer options. (Store directly in DB)
  // request.user.avatar = request.file.buffer;
  /**
   * Passing Sharp NPM Library for img optimization
   * @see The image is converted also to PNG
   */

  try{
    const buffer = await sharp( request.file.buffer ).resize({ width: 250, height: 250 }).png().toBuffer();
    request.user.avatar = buffer;
    await request.user.save();
    response.send();

  } catch (e) {
    response.status(404).send();
  }



}, ( error, request, response, next ) => {
  response.status(400).send({ error: error.message });
});

/**
 * Challenge: Delete the user avatar.
 */
router.delete( '/users/me/avatar', auth, async ( request, response ) => {
  request.user.avatar = undefined;
  await request.user.save();
  response.send();
});

/**
 * Retrieve avatar
 */
router.get( '/users/:id/avatar', async ( request, response ) => {
  try {

    const user = await User.findById( request.params.id );
    if( ! user || ! user.avatar ) throw new Error();

    /**
     * Adding header to response.
     * @see by default Node JS retrieve data as JSON ( application/json )
     */
    response.setHeader('Content-type', 'image/png');
    response.send( user.avatar );

  } catch (e) {
    response.status(404).send();
  }
});

module.exports = router;