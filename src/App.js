import React, {
  Component
} from 'react';
import 'babel-polyfill'; //promises and Object.assign for flux

//components
import MacroTracker from './components/macrotracker.js';
//import Chart from './components/chart.js';
//<Chart data={RadarData} />



export class App extends Component {
  render () {
    return (
      <div>
        <div style={{textAlign:'center'}}>
          <MacroTracker />
        </div>
      </div>
    );
  }
}
