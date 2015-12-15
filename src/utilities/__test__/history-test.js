var expect = require('expect');
var History = require('../history');
var Immutable = require('immutable');

describe('History', function(){

  var currentProtein = 0;
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
    expect(currentData.get('count')).toEqual(0);

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
    expect(currentData.get('count')).toEqual(0);

  });

  it('undos history to null value, before first value', function(){
    var mockHistory = new History(initialProtein);
    mockHistory.addMacro(10);

    var currentData = mockHistory.getCurrent();
    expect(mockHistory.getIndex()).toEqual(1);
    expect(currentData.get('count')).toEqual(10);

    mockHistory.undo();
    currentData = mockHistory.getCurrent();
    expect(mockHistory.getIndex()).toEqual(0);
    expect(currentData.get('count')).toEqual(0);

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

  //describe getHistoryToPresentAsString

  it('returns a stringified version of the current history, if a history exists', function(){
    var mockHistory = new History(initialProtein);
    mockHistory.addMacro(10);

    var currentData = mockHistory.getCurrent();
    expect(mockHistory.getIndex()).toEqual(1);
    expect(currentData.get('count')).toEqual(10);

    mockHistory.undo();
    currentData = mockHistory.getCurrent();
    expect(mockHistory.getIndex()).toEqual(0);
    expect(currentData.get('count')).toEqual(0);

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

  it('returns an empty string, if the history has been undon beyond the first element', function(){
    var mockHistory = new History(initialProtein);
    mockHistory.addMacro(10);

    var currentData = mockHistory.getCurrent();
    expect(mockHistory.getIndex()).toEqual(1);
    expect(currentData.get('count')).toEqual(10);

    mockHistory.undo();
    currentData = mockHistory.getCurrent();
    expect(mockHistory.getIndex()).toEqual(0);
    expect(currentData.get('count')).toEqual(0);

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
