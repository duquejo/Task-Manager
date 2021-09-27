/**
 * Task Separated Routes
 * 
 * @requires express
 * @requires User Mongoose Model
 * @requires router Express Route
 * @requires auth Custom User Auth Middleware
 */
const express = require('express');
const Task = require('../models/task');
const auth = require('../middleware/auth');
const router = new express.Router();

/**
 * Task Insertion
 */
router.post( '/tasks', auth, async ( request, response ) => {

  // Old callback pattern way
  // const task = new Task( request.body );
  // task.save().then( () => response.status(201).send( task ) )
  //            .catch( e => response.status(400).send(e) );

  // const task =  new Task( request.body );

  /**
   * Adding User ObjectId to Task data.
   */
  const task = new Task({
    ...request.body, // ES6 Rest operator
    owner: request.user._id
  });

  try {
    await task.save();
    response.status(201).send( task );
  } catch (e) {
    response.status(400).send(e);
  }
});

/**
 * Tasks reading (All)
 * 
 * @improvement Now supports Filtering in the QueryString
 * Example: /tasks?completed=true
 * 
 * @improvement Now supports Pagination in the QueryString
 * Example: /tasks?limit=10&skip=0 (First Page)
 * Example: /tasks?limit=10&skip=10 (Second Page)
 * 
 * @improvement Now supports Sorting in the QueryString
 * Example: /tasks?sortBy=createdAt:desc
 */
router.get( '/tasks', auth, async ( request, response ) => {

  /**
   * Request Query will able us to use the provided querystring data
   */
  const match = {};
  const sort  = {};

  if ( request.query.completed ) {
    match.completed = request.query.completed === 'true'; // Passing as String
  }

  if( request.query.sortBy ){
    // sort: {
    //   // createdAt: '1' // 1 Ascending / -1 Descending
    //   completed: 1
    // }
    const parts    = request.query.sortBy.split(':');
    sort[parts[0]] = parts[1] === 'desc' ? -1 : 1;
  }



  // Task.find({}).then( tasks => response.send( tasks ) )
  //              .catch( e => response.status(500).send() );

  try {
    // Alternative #1 (Using Refs)
    // const tasks = await Task.find( { owner: request.user._id } );
    // response.send( tasks );

    // Alternative #2 (Using Mongoose Populate)
    // With Filtering functionality

    await request.user.populate({
      path: 'tasks',
      match,
      options: {
        // limit: request.query.limit ? parseInt( request.query.limit ) : {},
        // skip: request.query.skip ? parseInt( request.query.skip ) : {},
        sort
      }
    });
    response.send( request.user.tasks );

  } catch (e) {
    response.status(500).send(e);
  }
});

/**
 * Tasks reading by ObjectId
 */
router.get( '/tasks/:id', auth, async ( request, response ) => {

  // const _id = request.params.id;
  // Task.findById( _id ).then( task => {
  //   if( !task ) return response.status(404).send();
  //   response.send(task);
  // }).catch( e => {
  //   if( e.name = 'CastError' ) return response.status(400).send( 'Invalid ID' );
  //   response.status(500).send();
  // });

  const _id = request.params.id;

  try {

    // const task = await Task.findById( _id );

    /**
     * Modified Task finding. 
     * Now, The route only gets a logged in user task. If other user is trying to get it, the App responses 404.
     */
    const task = await Task.findOne( { _id, owner: request.user._id });

    if( ! task ) return response.status(404).send();
    response.send( task ); 

  } catch (e) {
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
 * Task Update Challenge
 * @see Middleware Challenge
 */
router.patch('/tasks/:id', auth, async ( request, response ) => {

  const updates          = Object.keys( request.body );
  const allowedUpdates   = [ 'description', 'completed' ];
  const isValidOperation = updates.every( update => allowedUpdates.includes( update ) );

  if( ! isValidOperation ) return response.status(400).send( { error: 'Invalid updates' });

  try {

    // Old way
    // const task = await Task.findById( request.params.id );
    const task = await Task.findOne({ _id: request.params.id, owner: request.user._id });

    // Direct query
    // const task = await Task.findByIdAndUpdate( request.params.id, request.body, { new: true, runValidators: true } );
    // Not found
    if( ! task ) return response.status(404).send();    

    updates.map( update => task[update] = request.body[update] );
    await task.save();

    // Success
    response.send( task );

  } catch (e) {
    // Validations
    response.status(400).send(e);
  }
});

/**
 * Delete resource Challenge
 */
router.delete( '/tasks/:id', auth, async ( request, response ) => {
  try {

    // const task = await Task.findByIdAndDelete( request.params.id );
    const task = await Task.findOneAndDelete({ _id: request.params.id, owner: request.user._id });

    if( !task ) return response.status(404).send();
    response.send( task );

  } catch (e) {
    response.status(500).send( e );
  }
});

module.exports = router;