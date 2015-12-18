var expect = require('expect');
var History = require('../history');
var Immutable = require('immutable');

describe('History', function(){

  var currentProtein = '';
  var initialProtein = Immutable.fromJS([{macro: 'protein', count: currentProtein, timestamp: Date.now()}]);

  it('creates a new history instance when provided an immutable List of Maps', function(){
    var mockHistory = new History(initialProtein);
    expect(mockHistory).toExist();
  });

  it('returns the current index index', function(){
    var mockHistory = new History(initialProtein);
    expect(mockHistory.getIndex()).toEqual(0);
  });

  it('returns the current value at that index', function(){
    var mockHistory = new History(initialProtein);
    var currentData = mockHistory.getCurrent();
    expect(currentData.get('count')).toEqual('');

  });

  it('increments the history with new data, updating index and value', function(){
    var mockHistory = new History(initialProtein);
    mockHistory.addMacro(10);

    var currentData = mockHistory.getCurrent();
    expect(mockHistory.getIndex()).toEqual(1);
    expect(currentData.get('count')).toEqual(10);

  });

  //describe undo

  it('undos history back to first value', function(){
    var mockHistory = new History(initialProtein);
    mockHistory.addMacro(10);

    var currentData = mockHistory.getCurrent();
    expect(mockHistory.getIndex()).toEqual(1);
    expect(currentData.get('count')).toEqual(10);

    mockHistory.undo();
    currentData = mockHistory.getCurrent();
    expect(mockHistory.getIndex()).toEqual(0);
    expect(currentData.get('count')).toEqual('');

  });

  it('undo history of the first value does nothing', function(){
    var mockHistory = new History(initialProtein);
    mockHistory.addMacro(10);

    var currentData = mockHistory.getCurrent();
    expect(mockHistory.getIndex()).toEqual(1);
    expect(currentData.get('count')).toEqual(10);

    mockHistory.undo();
    currentData = mockHistory.getCurrent();
    expect(mockHistory.getIndex()).toEqual(0);
    expect(currentData.get('count')).toEqual('');

    mockHistory.undo();
    currentData = mockHistory.getCurrent();
    expect(mockHistory.getIndex()).toEqual(0);
    expect(currentData.get('count')).toEqual('');


  });

  //describe getHistoryToPresentAsString

  it('returns a stringified version of the current history, if a history exists', function(){

    //so the first increment creates a new history with the input
    var mockHistory = new History(initialProtein);

    //second click adds
    mockHistory.addMacro(10);

    var currentData = mockHistory.getCurrent();
    expect(mockHistory.getIndex()).toEqual(1);
    expect(currentData.get('count')).toEqual(10);
    var stringHistory = mockHistory.getHistoryToPresentAsString();
    expect(stringHistory).toEqual('10');

    mockHistory.addMacro(20);
    stringHistory = mockHistory.getHistoryToPresentAsString();
    expect(stringHistory).toEqual('10+20');

  });

  it('returns the correct string after one undo', function(){
    var mockHistory = new History(initialProtein);
    mockHistory.addMacro(10);

    var stringHistory = mockHistory.getHistoryToPresentAsString();

    expect(stringHistory).toEqual('10');

    mockHistory.undo();
    stringHistory = mockHistory.getHistoryToPresentAsString();

    expect(stringHistory).toEqual('');

  });

  it('history initialized to an empty string prints an empty string', function(){
    var initialProtein = Immutable.fromJS([{macro: 'protein', count: '', timestamp: Date.now()}]);
    var mockHistory = new History(initialProtein);

    var stringHistory = mockHistory.getHistoryToPresentAsString();

    expect(stringHistory).toEqual('');

  });



  it('returns an empty string when initial value is undoed', function(){
    //so here, when we undo beyond the first element
    //we have to create a new Map, where all values are null
    //one potential solution at least
    /*
    mockHistory.undo();
    currentData = mockHistory.getCurrent();
    expect(mockHistory.getIndex()).toEqual(-1);
    expect(currentData.get('count')).toEqual(null);
    */


  });

});
