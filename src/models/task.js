/**
 * 
 * Task Model
 * @requires mongoose
 */
 const mongoose  = require('mongoose');

 /**
  * 
 * Task Model Definition & Middleware Schema
 * @update Creating a relationship aproach between Task and User.
 */
const taskSchema = new mongoose.Schema({
  description: {  
    type: String,
    trim: true,
    required: true
  },
  completed: {
    type: Boolean,
    default: false
  },
  owner: {
    type: mongoose.Schema.Types.ObjectId, // Mongoose ObjectId correct Type.
    required: true,
    ref: 'User' // Reference other models
  }
},{ timestamps: true });

const Task = mongoose.model( 'Task', taskSchema );

module.exports = Task;