/**
 * 
 * User Model Definitions
 * @requires mongoose
 * @requires validator
 * @requires bcryptjs
 * @requires jwt
 * 
 */
const mongoose  = require('mongoose');
const validator = require('validator');
const bcrypt    = require('bcryptjs');
const jwt       = require('jsonwebtoken');
const Task      = require('../models/task');

/**
 * With Mongoose we can create Middlewares
 * @description A middleware is defined like a post hook validations. It could be called before or after validations 
 * @see We need to define a Schema 
 * 
 * @see We can configure additional parameters in the Schema Structure, passing as second argument an object.
 */

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true, // Remove initial and final spaces
    validate( value ) {
      if( value.length === 0 ) throw new Error('The name field is mandatory');
    }
  },
  password:{
    type: String,
    trim: true,
    required: true,
    minLength: 7,
    validate( value ) {
      if( value.includes('password') ) throw new Error('Your password cannot contain "password" word');
    }
  },
  email:{
    type: String,
    required: true,
    unique: true, // Mongoose will handle email as a unique index
    trim: true, // Remove initial and final spaces
    lowercase: true, // Convert any source to lowercase
    validate( value ) {
      if( ! validator.isEmail( value ) ) throw new Error('Email is invalid');
    }
  },
  age: {
    type: Number,
    default: 0, // Default values for age.
    validate( value ) {
      // ES6 Syntax
      if( value < 0 ) throw new Error('Age must be a number greater than zero.');
    }
  },
  tokens: [{
    token: {
      type: String,
      required: true
    }
  }],
  avatar: {
    type: Buffer // Type for filebytes data
  }
},{ timestamps: true });

/**
 * We can make a implicit relationship between different collections with 'virtual'
 * @param ref Task Model name
 * @param localField User param to reference into Task Model
 * @param foreignField Task referenced User Model parameter
 */
userSchema.virtual( 'tasks', {
  ref: 'Task',
  localField: '_id',
  foreignField: 'owner'
});

/**
 * Define Schema Custom Static/Methods Model functions
 * 
 * @see difference between Statics/Methods:
 * Statics are for functions that can be called on the Model itself while methods are 
 * functions that require an instance of the method to be called. You use statics for function 
 * you want to run on the entire collection whereas methods are used for individual documents 
 * in that collection.
 */

userSchema.methods.generateAuthToken = async function (){
  const user = this;
  const token = jwt.sign( { _id: user._id.toString() }, process.env.JWT_SECRET );

  user.tokens = user.tokens.concat({ token });
  await user.save();
  
  return token;
};

/**
 * Overriding toJSON Mongoose to enable native sensitive info removal.
 * @returns Object
 */
userSchema.methods.toJSON = function() {
  const user       = this;
  const userObject = user.toObject(); // Mongoose method.

  /**
   * Deleting private info
   */
  delete userObject.password;
  delete userObject.tokens;
  delete userObject.avatar;

  return userObject;
};

/**
 * findByCredentials
 * Logic for user login credentials check.
 * @param {string} email 
 * @param {string} password 
 * @returns User Model
 */
userSchema.statics.findByCredentials = async ( email, password ) => {
  const user = await User.findOne({ email });
  if( !user ) throw new Error('Unable to login');

  const isMatch = await bcrypt.compare( password, user.password );
  if( !isMatch ) throw new Error('Unable to login');

  return user;
};

/**
 * Define Middleware ( Hash the plain text password before saving )
 * @see Don't Forget to save it as normal function, because we could lose the context. 
 * @see IF we need to use the middleware in other contexts (like Update or anywhere) we need to set it into the route. (Save function!)
 */
userSchema.pre('save', async function ( next ) {

  const user =  this;

   /**
   * Actions before model check
   * @see bcryptjs hashing passwords logic
   */ 
  if( user.isModified('password') ){
    user.password = await bcrypt.hash( user.password, 8 ); // Passing bcrypt
  }

  /**
   * End Middleware
   */
  next();
});

/**
 * Cascade delete tasks when the user is removed
 */
userSchema.pre('remove', async function( next ) {
  const user = this;
  await Task.deleteMany({ owner: user._id });
  next();
});

/**
 * Creating mongoose models
 * @param model_name
 * @param model_options and variable settings (Boolean, String, Number, etc)
 * 
 * @see for more complex validations, check: https://www.npmjs.com/package/validator
 */
 const User = mongoose.model( 'User', userSchema );

module.exports = User;