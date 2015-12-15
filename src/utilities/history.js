/*
History is an Immutable Array, containing maps(Immutable.js version of objects)
With helper methods and data to manage undo and redo

Current implementation is application specific

Instantiation requires a map containing the macro, the count, and a timestamp
var history = Immutable.fromJS([{macro: 'fat', count: 0, timestamp: Date.now()}]);
var testHistory = new History(history);


*/

var Immutable = require("immutable");

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

//TODO: Create a method that returns a string of history array values up to the current index
History.prototype.getHistoryToPresentAsString = function(){
  var currentData = this.getData();
  var currentCount = currentData.map(function(x){return x.get('count');});
  return currentCount.interpose('+').reduce(function(a,b){return a + b;});
};

History.prototype.getHistorySum = function(){
  var currentData = this.getData();
  var currentSum = currentData.map(function(x){return x.get('count');}).reduce(function(a,b){return a + b;});
  return currentSum;
};

module.exports = History;
