import AppDispatcher from '../dispatcher/appdispatcher'
import MacroConstants from '../constants/macroconstants'

var MacroActions = {

  /**
   * @param {number} amount to add to the updated macro
   * @param {string} which macro to add the increment for update
   */

  updateMacro: function(increment,macro){
    AppDispatcher.handleViewAction({
      actionType: MacroConstants.MACRO_UPDATE,
      increment: increment,
      macro: macro
    });

  },
  incrementMacro: function(increment,macro){
    AppDispatcher.handleViewAction({
      actionType: MacroConstants.MACRO_INCREMENT,
      increment: increment,
      macro: macro
    });

  },
  undoIncrement: function(macro){
    AppDispatcher.handleViewAction({
      actionType: MacroConstants.UNDO_INCREMENT,
      macro: macro
    });

  },
  redoIncrement: function(macro){
    AppDispatcher.handleViewAction({
      actionType: MacroConstants.REDO_INCREMENT,
      macro: macro
    });
  }

};


module.exports = MacroActions;
