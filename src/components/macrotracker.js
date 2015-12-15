import React, {
  Component
} from 'react';

import AppDispatcher from '../dispatcher/appdispatcher';
import MacroConstants from '../constants/macroconstants';
import MacroActions from '../actions/macroactions.js';
import MacroBar from './macrobar.js';
import MacroStore from '../stores/usermacrostore.js';

import Immutable from 'immutable';
//TODO: Pull the immutable history component over to the macro tracker

//bootstrap styling
require('!style!css!less!bootstrap/less/bootstrap.less');

function getMacroState(){
  return {
    allMacros: MacroStore.getAll()
  };
}


var MacroTracker = React.createClass({

  getInitialState: function(){

      return getMacroState();

  },

  componentDidMount: function(){
    MacroStore.addChangeListener(this._onChange);

  },

  componentWillUnmount: function(){
    MacroStore.removeChangeListener(this._onChange);

  },

  render: function() {
    return (
      <div className="container">

        <MacroBar data={this.state.allMacros} category={'protein'}/>
        <MacroBar data={this.state.allMacros} category={'fat'}/>
        <MacroBar data={this.state.allMacros} category={'carbs'}/>

      </div>

    );

  },

  _onChange: function(){
    this.setState(getMacroState());
  }

});

module.exports = MacroTracker;
