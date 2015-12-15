var React = require('react');
var TestUtils = require('react-addons-test-utils');
var expect = require('expect');
var App = require('../App.js');

describe('App', function(){
  it('runs a test', function(){
    expect(App).toExist();
  });
});
