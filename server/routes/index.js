var express = require('express');
var router = express.Router();
var pg = require('pg');
var config = require('../../db_config');
var sequelize = require('sequelize');
var connectionstring = "postgres://" + config.username + ':' + config.password + '@localhost/' + config.database;


router.use(function(req,res,next) {
  console.log("/" + req.method);
  next();
});

//user story
//I visit the page for the first time, enter the protein I just ate, and hit the green protein button
//That protein gets saved. I then enter my fat and carbs for the meal. And press the green button.
//It's all saved.
//I go about my day.
//I come back to the page later. My macros are still there. I enter my protein fat and carbs.
//
//I accidentally close the browser window. I come back. I want to start where I left off.
//I enter in my user ID. My info comes right back.
//I pick up where I left off.
//
//
//Ok. So how do we create a persistent datastore on an app.
//Login and username.
//They can only enter data once we have confirmed who they are.
//
//How do we do it without login and username?
//Every write/read to the DB has to be associated with a unique ID.
//
//How do we create a persistent datastore with unique ID?
//When the user hits the green button, we prompt them for their ID.
//If they don't have one, we create a new one.
//If they do have one, we read from the db.
//
//Need a field at the bottom of the app that prints their unique ID
//And if they don't have one, it tells them they don't have one.
//
//the green button saves their macro history, and allows them to move forward in the register
//
//

//Ok. So we need to...
//Create new users and return the user id to the app. User ID is now part of the flux store.
//Check if user id exists.
//Read data based on user id. The data is json, that is converted into immutable.js List of Maps.
//Write data to a user. The data begins as an immutable.js List of Maps, and then is converted to json data.


//
//
// create a new userid
// /api/v1/id

router.post('/id', function(req,res){
  console.log('new user', connectionstring);
  res.send('create new user');


});

// check if user exists
// /api/v1/id/:userid

router.get('/id/:user_id', function(req,res){

  var id = req.params.user_id;
  console.log(id);
  res.send('check if user exits');

});


// update macros based on user id
// /api/v1/macros/:user_id
router.post('/macros/:user_id', function(req,res){

  var id = req.params.user_id;
  console.log(id);
  res.send('update macros');

});


// get todays macros
// /api/v1/:userid
router.get('/macros', function(req,res){

  var id = req.params.user_id;
  console.log(id);
  res.send('get macros');

});

module.exports = router;
