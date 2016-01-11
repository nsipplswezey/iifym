import React, {
  Component
} from 'react';

import MacroActions from '../actions/macroactions'

//import component
var Swipeable = require('react-swipeable')

var MacroCount = React.createClass({

  render: function(){
    var readOut;
    var currentSum = this.props.historysum + this.props.currentcount;

    if(this.props.currenthistory){
      readOut = this.props.currenthistory + ' + ' + this.props.currentcount + ' = ' + currentSum;
    } else {
      readOut = this.props.currentcount;
    }

    return(
    <Swipeable className="swipeable" onSwipedRight={this._onRedoSwipe} onSwipedLeft={this._onUndoSwipe}>
      <input className="form-control" value={readOut} data-test={this.props.category + '-identifier'} type="text" placeholder="Current count..." readOnly readonly>
      </input>
    </Swipeable>
    );

  },
  _onUndoSwipe: function(){
    var macro = this.props.category;
    console.log('undo swipe',this.props.category);
    MacroActions.undoIncrement(macro);

  },

  _onRedoSwipe: function(){
    var macro = this.props.category;
    console.log('redo swipe',this.props.category);
    MacroActions.redoIncrement(macro);

  }

});

var MacroIdentifier = React.createClass({

  render: function(){
    return(
      <button className={"btn btn-success col-xs-3"} data-test={this.props.text + '-count'} onTouchEnd={this._onIncrementClick}>
        {this.props.text}
      </button>
    );

  },

  _onIncrementClick : function(){
    //get the current increment count

    var increment = this.props.currentCount;
    var macro = this.props.text;
    MacroActions.incrementMacro(increment,macro);


  }

});

var MacroButton = React.createClass({

  render: function(){
    return(
      <button className={"btn btn-primary col-xs-3"} onTouchEnd={this._onUpdateClick} data-test={this.props.category + '-' + this.props.value}>
        {'+' + this.props.value}
      </button>
    );

  },

  _onUpdateClick: function(){

    var increment = this.props.value;
    var macro = this.props.category;

    MacroActions.updateMacro(increment,macro);

  }

});

var MacroBar = React.createClass({

  propTypes: {
  },

  render: function() {

    var currentUser = 1;
    var currentDay = 0;
    var currentUserData = this.props.data[currentUser];
    var currentUserDataDay = currentUserData[currentDay];

    var macro = this.props.category;

    var macroOptions = {
      carbs : {
        current: currentUserDataDay.currentCarb,
        history: currentUserDataDay.todaysCarb
      },
      fat : {
        current: currentUserDataDay.currentFat,
        history: currentUserDataDay.todaysFat
      },
      protein : {
        current: currentUserDataDay.currentProtein,
        history: currentUserDataDay.todaysProtein
      }
    };

    var currentBarData = macroOptions[macro].current;

    var currentBarHistory = macroOptions[macro].history ? macroOptions[macro].history.getHistoryToPresentAsString() : null;

    var currentBarHistorySum = macroOptions[macro].history ? macroOptions[macro].history.getHistorySum() : 0;

    return (

        <div className="row center-block">
          <MacroIdentifier text={this.props.category} currentCount={currentBarData}/>
          <MacroButton value={10} category={this.props.category}/>
          <MacroButton value={5} category={this.props.category}/>
          <MacroButton value={1} category={this.props.category}/>
          <MacroCount
            currentcount={currentBarData}
            currenthistory={currentBarHistory}
            historysum={currentBarHistorySum}
            category={this.props.category}
          />
        </div>

    );

  }

});

module.exports = MacroBar;
