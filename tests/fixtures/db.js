/**
 * 
 * JEST Setup
 * @see Setting user objects.
 * 
 * @requires mongoose
 * @requires jsonwebtoken
 * @requires User model
 */
const mongoose = require('mongoose');
const jwt      = require('jsonwebtoken');
const User     = require('../../src/models/user');
const Task     = require('../../src/models/task');

/**
 * Factory data for DB
 */
const userOneId = new mongoose.Types.ObjectId();

const userOne = {
  _id: userOneId,
  name: 'Sergio',
  email: 'sergio@example.com',
  password: 'demodemo',
  tokens: [{
      token: jwt.sign( { _id: userOneId } , process.env.JWT_SECRET )
  }]
};

const userTwoId = new mongoose.Types.ObjectId();

const userTwo = {
  _id: userTwoId,
  name: 'Marco',
  email: 'marco@example.com',
  password: 'marcodemo',
  tokens: [{
    token: jwt.sign( { _id: userTwoId }, process.env.JWT_SECRET )
  }]
};

const taskOne = {
  _id: new mongoose.Types.ObjectId,
  description: 'First task',
  completed: false,
  owner: userOneId
};

const taskTwo = {
  _id: new mongoose.Types.ObjectId,
  description: 'Second task',
  completed: true,
  owner: userOneId
};

const taskThree = {
  _id: new mongoose.Types.ObjectId,
  description: 'Three task',
  completed: false,
  owner: userTwoId
};

const setupDatabase = async () => {

  /**
   * Clean DB
   */
  await User.deleteMany();
  await Task.deleteMany();

  /**
   * Test user for creation.
   */
  await new User( userOne ).save();
  await new User( userTwo ).save();

  await new Task( taskOne ).save();
  await new Task( taskTwo ).save();
  await new Task( taskThree ).save();
};

module.exports = {
  userOneId,
  userOne,
  userTwo,
  userTwoId,
  setupDatabase,
  taskOne,
  taskTwo,
  taskThree
};