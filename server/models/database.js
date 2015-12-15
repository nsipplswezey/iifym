var pg = require('pg');
var config = require('../../db_config');
var sequelize = require('sequelize');
var constring = "postgres://" + config.username + ':' + config.password + '@localhost/' + config.database;

//a quick test of using transit and immutable to write and read immutable json
var Immutable = require("immutable");
var transit = require("transit-js");

//first we create a transit reader
//it reads json and builds an immutable array or map(object) out of it
var immutableReader = transit.reader('json', {
  arrayBuilder: {
    init: function(node) { return Immutable.List().asMutable(); },
    add: function(ret, val, node) { return ret.push(val); },
    finalize: function(ret, node) { return ret.asImmutable(); },
    fromArray: function(arr, node) { return Immutable.fromJS(arr); }
  },
  mapBuilder: {
    init: function(node) { return Immutable.Map().asMutable(); },
    add: function(ret, key, val, node) { return ret.set(key,val); },
    finalize: function(ret, node) { return ret.asImmutable(); }
  }

});

var ListHandler = transit.makeWriteHandler({
  tag: function(v){ return "array"; },
  rep: function(v){ return v; },
  stringRep: function(v){ return null; }
});

var MapHandler = transit.makeWriteHandler({
  tag: function(v){ return "map"; },
  rep: function(v){ return v; },
  stringRep: function(v){ return null; }
});

var immutableWriter = transit.writer('json-verbose', {
  handlers: transit.map([
    Immutable.List, ListHandler,
    Immutable.Map, MapHandler
  ])
});

var immutableArray = immutableReader.read('[1,2,3]');
var immutableMap = immutableReader.read('{"foo":"bar"}');

var wroteArray = immutableWriter.write(immutableArray);
var wroteMap = immutableWriter.write(immutableMap);

//So lets test if wriiting the array to json, then reading it back... breaks it
var myselfNotImmutable = {name : 'Tom'};
var someoneElseNotImmutable = myselfNotImmutable;
myselfNotImmutable.name = 'Thomas';
//my changing the origional, I also change its copies
//because it's copies exist by reference

var myself = Immutable.Map({ name: 'Tom' });
var someoneElse = myself.set('name', 'Thomas');
myself.name = 'Thomas';
//If I change the origional, I don't change things created from it
//Immutable gives us ways to 'clone' objects without actually cloning them
//I want to see if this feature survives a write and read

//operations take data, and return a new version of it
var historyIndex = 0;
var history = Immutable.fromJS([{macro: 'fat', count: 0, timestamp: Date.now()}]);

//so this functionality is a combination of data
//and methods that operate on data

//each history object has a history index
//as well as a history List which is output from the database

//Reading: the history List comes out of the database
//Gets taken as input into object that maintains its index

var History = function(history,macroType){
  this.historyData = history;
  this.historyIndex = history.size - 1;
  this.macro = macroType || history.get(0).get('macro');
  this.hasUndo = this.historyIndex !== 0;
  this.hasRedo = this.historyIndex !== this.historyData.size - 1;
};

History.prototype._operation = function(fn){
  var history = this.historyData.slice(0, this.historyIndex + 1);
  var newVersion = fn(history.get(this.historyIndex));

  this.historyData = history.push(newVersion);

  //here the helper does a lot of work that's out of scope
  //other operations might decrement.
  //but we also don't want to make these changes in addMacro
  //because we don't know if the actually worked as intended until here
  this.historyIndex++;
  this.hasUndo = this.historyIndex !== 0;
  this.hasRedo = this.historyIndex !== this.historyData.size - 1;

};
History.prototype.addMacro = function(newMacroCount){
  /*
  * @param number integer
  * Takes a new macro integer and adds it to the list
  * using the _operation helper
  */
  this._operation(function(inputMap){
    return inputMap
    .set('count', newMacroCount)
    .set('timestamp', Date.now());
  });

};
History.prototype.getIndex = function(){
  return this.historyIndex;

};
History.prototype.undo = function(){
  if (this.historyIndex > 0) this.historyIndex--;

};
History.prototype.redo = function(){
  if (this.historyIndex < this.historyData.size) {
    this.historyIndex++;
    //draw or update
    //console.log('redo',history.get(historyIndex));
  }
};

History.prototype.getCurrent = function(){
  return this.historyData.get(this.historyIndex);
};

History.prototype.getData = function(){
  return this.historyData;
};

var testHistory = new History(history);

//convert these into server side tests
console.log('history instantiated', testHistory, testHistory.getIndex());

testHistory.addMacro(4);
console.log('post add',testHistory,testHistory.getIndex());
testHistory.addMacro(5);
console.log('post add again',testHistory,testHistory.getIndex());
testHistory.undo();
console.log('after undo',testHistory.getCurrent());
testHistory.redo();
console.log('after redo',testHistory.getCurrent());

testHistory.undo();
console.log('after second undo', testHistory.getCurrent());
testHistory.addMacro(9);
console.log('after second undo, then add', testHistory.getCurrent());

testHistory.undo();
testHistory.undo();
testHistory.undo();
console.log('after multi undo', testHistory.getCurrent());
testHistory.addMacro(11);
console.log('after multi undo, then add', testHistory.getCurrent());

//so each macro needs its own undo and redo

var wroteHistory = immutableWriter.write(testHistory.getData());
var readHistory = immutableReader.read(wroteHistory);

var retrievedHistory = new History(readHistory);
console.log(retrievedHistory);


/*
TODO: Take everything above this line and refactor it into a seperate file
Import that file as a library
Run tests against that file

*/


var connectionString = process.env.DATABASE_URL || constring;


var client = new pg.Client(connectionString);
client.connect();

/*
client.query("CREATE TABLE junk(name VARCHAR(40), a_number INT not null)");


var x = 100;

while(x > 0){
  client.query("INSERT INTO junk(name, a_number) values('Ted',12)");
  client.query("INSERT INTO junk(name, a_number) values($1, $2)", ['John', x]);
  x = x - 1;

}
*/


//client.query("CREATE TABLE users (id UUID PRIMARY KEY, name TEXT)");

//User declares they are DONE with their macros for the day, and complete is toggled
//client.query("CREATE TABLE activedays (id UUID REFERENCES users, day DATE, complete BOOLEAN)");

//UUID references recorded macros for the day
//JSONB is updated in real time to maintain persistence including undo/redo
//even if browser is closed and reopened
//client.query("CREATE TABLE currentusermacros (id UUID REFERENCES users, day DATE, macroprotein JSONB, macrofat JSONB, macrocarb JSONB)");

console.log(Promise);

function checkUser(uuid,callback){

  var queryConfig = {
    text: "SELECT exists(select id from users where id=$1)",
    values: [uuid],
  };

  var query = client.query(queryConfig,function(err, result){
    if(err){
      console.error("$s", err);
      callback(null);

    }else{
      var resultObj = result.rows[0];
      console.log('check user result',result.rows[0]);
      console.log('check user result',resultObj);
      callback(resultObj);
    }
  });


}

function createUser(name){
  var userName = name || 'testUser';
  client.query("INSERT INTO users(id, name) values(gen_random_uuid(), $1)", [userName]);
}

//createUser();
//createUser('Nick');
console.log('check user 1',checkUser('318a1ef3-28b9-4629-b9fc-8112b9de7b13',function(result){}));
console.log('check user 2',checkUser('goo'));

function writeMacro(uuid,umacroType,history){

}

var query = client.query("SELECT * FROM users");
query.on('row', function(row){
  console.log(row);
});


query.on('end', function(){
  client.end();
});


/*
var query = client.query("SELECT * FROM junk");

query.on('row', function(row){
  console.log(row);
});

query.on('end', function(){
  client.end();

});
*/
