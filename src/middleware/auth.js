/**
 * 
 * Authentication Middleware
 * 
 * @requires jsonwebtoken
 * @requires User Model
 * 
 */
const jwt = require('jsonwebtoken');
const User = require('../models/user');

const auth = async ( request, response, next ) => {

  try {

    // Getting Authorization header from request and remove Bearer string.
    const token   = request.header('Authorization').replace( 'Bearer ', '' );

    // Verifing JWT from header.
    const decoded = jwt.verify( token, process.env.JWT_SECRET );

    // Getting User
    const user    = await User.findOne({ _id: decoded._id, 'tokens.token': token });

    if( !user ) throw new Error();

    /**
     * Passing current validated and authenticated user into the middleware routes.
     * Passing current auth token as request parameter
     */
    request.token = token;
    request.user = user;
    next();

  } catch (e) {
    response.status(401).send({ error: 'Please authenticate.'});
  }
};

module.exports = auth;