var React = require('react');
var TestUtils = require('react-addons-test-utils');
var expect = require('expect');
var MacroStore = require('../usermacrostore.js');

describe('MacroStore', function(){
  var _store = MacroStore.getAll();
  it('has a getAll method that returns the store', function(){
    expect(MacroStore.getAll).toExist();
    expect(_store).toExist();
  });
  it('the returned store contains macro data for a user ID and day', function(){
    var id = 1;
    var day = 0;

    var userStore = _store[id];
    console.log(_store);
    var userDayStore = userStore[day];

    expect(userStore).toExist();
    expect(userDayStore).toExist();

  });

});
