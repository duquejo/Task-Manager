/**
 * 
 * Mongoose Methods
 * @description Mongoose is a NPM Library that helps to make more complex Mongodb operations with
 * well formed models, validations and more.
 * 
 * @requires mongoose
 * @requires mongodb
 * 
 * @requires validator for custom complex variable validations
 * 
 */
const mongoose  = require('mongoose');

/**
 * Mongoose connection
 * @param connectionURL 'with mongodb://' remember add databasename as part of connection string
 * @param optionsObject
 */
const connectionURL = process.env.MONGODB_URL;

mongoose.connect( connectionURL, {
  useNewUrlParser: true
});