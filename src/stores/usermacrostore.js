var AppDispatcher = require('../dispatcher/appdispatcher');
var EventEmitter = require('events').EventEmitter;
var MacroConstants = require('../constants/macroconstants');
var History = require('../utilities/history');
import Immutable from 'immutable';


var initialFat = Immutable.fromJS([{macro: 'fat', count: '', timestamp: Date.now()}]);
var initialProtein = Immutable.fromJS([{macro: 'protein', count: '', timestamp: Date.now()}]);
var initialCarb = Immutable.fromJS([{macro: 'carb', count: '', timestamp: Date.now()}]);


//so these are a series of actions
//passed to the dispatcher and evaluated in the dispatcher context

var CHANGE_EVENT = 'change';


var _userMacros = {
  //mock data
  //user id
  1 : {
    //current day
    0 : {
      //the current register before entry
      currentProtein : 0,
      currentFat : 0,
      currentCarb : 0,
      //todays history is created on the fly
      todaysProtein : new History(initialProtein),
      todaysFat : new History(initialFat),
      todaysCarb : new History(initialCarb)

    }

  }

}; //collection of macros




/**
 * Updates the current macro sum for any macro
 * @param {string} text Which macro to add to
 * @param {number} integer Amount to add to current macro sum
 */
function updateMacro(macro,increment){

  //TODO: create a unique ID checking system
  var id = 1;

  //TODO: create a 'day' interval that resets at 4am
  var currentDay = 0;

  var user = _userMacros[id];
  var todaysMacros = user[currentDay];
  //console.log('updateMacro', todaysMacros);

  //lets make this undoable from the start
  //by using the data structure I had before

  if(macro==='protein'){
    todaysMacros.currentProtein += increment ;

  }else if(macro==='fat'){
    todaysMacros.currentFat += increment;

  }else if(macro==='carbs'){
    todaysMacros.currentCarb += increment;

  }else{
    console.log('error in update macro');
  }

  //console.log('post update', todaysMacros);

}


/**
 * Registers the addition of a macro by pushing the current macro sum
 * into the current macro array, which is displayed below.
 * @param {string} text Which macro to add to
 * @param {number} integer Current macro sum to push to macro sum array
 */
function incrementMacro(macro,currentSum){
  //TODO: create a unique ID checking system
  var id = 1;

  //TODO: create a 'day' interval that resets at 4am
  var currentDay = 0;

  var user = _userMacros[id];
  var todaysMacros = user[currentDay];

  if(macro==='protein'){
    todaysMacros.todaysProtein.addMacro(currentSum);
    //reset current
    todaysMacros.currentProtein = 0;

  }else if(macro==='fat'){
    todaysMacros.todaysFat.addMacro(currentSum);
    //reset current
    todaysMacros.currentFat = 0;

  }else if(macro==='carbs'){
    todaysMacros.todaysCarb.addMacro(currentSum);
    //reset current carb
    todaysMacros.currentCarb = 0;

  }else{
    console.log('error in increment macro');
  }

}

function undoIncrement(macro){
  //TODO: create a unique ID checking system
  var id = 1;

  //TODO: create a 'day' interval that resets at 4am
  var currentDay = 0;

  var user = _userMacros[id];
  var todaysMacros = user[currentDay];

  console.log('undoincrement')

  if(macro==='protein'){
    //if history exists, and it has an undo, undo it
    if(todaysMacros.todaysProtein && todaysMacros.todaysProtein.hasUndo){
      todaysMacros.todaysProtein.undo();
    } else {
      //if no history exists, do nothing
    }

  }else if(macro==='fat'){
    //if history exists, and it has an undo, undo it
    if(todaysMacros.todaysFat && todaysMacros.todaysProtein.hasUndo){
      todaysMacros.todaysProtein.undo();
    } else {
      //if no history exists, do nothing
    }

  }else if(macro==='carbs'){
    console.log('undoincrement carbs',todaysMacros.todaysCarb)
    //if history exists, and it has an undo, undo it
    if(todaysMacros.todaysCarb && todaysMacros.todaysCarb.hasUndo){
      console.log('undoincrement carbs history')
      todaysMacros.todaysCarb.undo();
    } else {
      console.log('undoincrement carbs no history')
      //if no history exists, do nothing
    }

  }else{
    console.log('error in undo macro');
  }

}
function redoIncrement(macro){


}


/**
 *  Retrieve or create a new macro history. If ID is provided, retrieves macros from DB.
 *  If no ID is provided, creates a new set of macros
 * @param {string} text The unique ID for the user
 */
function createMacroDay(uniqueID){


}

/**
 * If no ID is provided, create a macro user id and local object to store macro data
 *
 * @param {string} text The unique ID for the user
 */
 function createLocalMacroUser(uniqueID){


 }


var MacroStore = Object.assign({}, EventEmitter.prototype,{

  getAll: function(){
    return _userMacros;
  },

  emitChange: function(){
    this.emit(CHANGE_EVENT);
  },

  addChangeListener: function(callback){
    this.on(CHANGE_EVENT, callback);
  },

  removeChangeListener: function(callback){
    this.on(CHANGE_EVENT, callback);

  },

  dispatcherIndex: AppDispatcher.register(function(payload){
    var action = payload.action;
    //console.log(action);
    var integerIncrement = action.increment;
    var targetMacro = action.macro;

    switch(action.actionType) {

      case MacroConstants.MACRO_UPDATE:
      updateMacro(targetMacro,integerIncrement);
      MacroStore.emitChange();
      break;

      case MacroConstants.MACRO_INCREMENT:
      incrementMacro(targetMacro,integerIncrement);
      MacroStore.emitChange();
      break;

      case MacroConstants.UNDO_INCREMENT:
      undoIncrement(targetMacro);
      MacroStore.emitChange();
      break;

      case MacroConstants.REDO_INCREMENT:
      redoIncrement(targetMacro);
      MacroStore.emitChange();
      break;
    }
    return true;

  })

});

module.exports = MacroStore;
