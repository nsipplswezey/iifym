var Dispatcher = require('./dispatcher');

var AppDispatcher = Object.assign({}, Dispatcher.prototype, {

  //app dispatcher extends dispatcher
  //it invokes the dispatch method on the Dispatcher prototype
  //with a payload object
  //that contains a source
  //and an action... unclear what this action is, or how it gets invoked
  handleViewAction: function(action){
    this.dispatch({
      source: 'VIEW_ACTION',
      action: action

    });
  }
});


module.exports = AppDispatcher;
