//promises and Object.assign work because of babel-polyfill in App.js

var _callbacks = [];
var _promises = [];


var Dispatcher = function(){};
Dispatcher.prototype = Object.assign({}, Dispatcher.prototype, {

  //
  register: function(callback){
    _callbacks.push(callback);
    return _callbacks.length - 1;
  },

  //payload is an object... the data from the action
  dispatch: function(payload){
    var resolves = [];
    var rejects = [];

    //promises is a collection of promises, one for each callback
    //and resolves and rejects arrays contain
    //the resolve and reject objects of the promises ...?
    _promises = _callbacks.map(function(_, i){
      return new Promise(function(resolve,reject){
        resolves[i] = resolve;
        rejects[i] = reject;

      });
    });

    //for each callback
    _callbacks.forEach(function(callback,i){
      //we resolve the callback,
      Promise.resolve(callback(payload)).then(function(){
        //and invoke the returned function on the payload
        resolves[i](payload);
      }, function(){
        //or the resultion is reject, and we throw an error
        rejects[i](new Error('Dispatch callback unsuccessful'));
      });
    });

    _promises = [];

  }

});

module.exports = Dispatcher;
