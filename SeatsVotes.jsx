import React, {Component} from 'react';
import {VictoryChart, VictoryAxis, VictoryScatter, VictoryLine} from 'victory';
import { TDistribution } from 'js-stats';

import SEATSVOTES from './seatsvotes.json';

class SeatsVotesCurve extends Component {
  constructor(props) {
    super(props)

    this.state = {
      df: 3,
      mmd: 0.03,
      width: 0.15,
      year: 2016,
    }
  }

  render() {
    const {df, mmd, width, year} = this.state;
    const results = SEATSVOTES[year];

    // Build a discrete line from the TDistribution
    const T = TDistribution(df);

    const votesToSeats = (voteshare) => T.cumulativeProbability((voteshare - mmd - 0.5) / width);
    const Tdiscrete = Array.from({length: 1000}, (x,i) => i/1000).map((x) => ({x: x, y: votesToSeats(x)}));

    return (
      <div id="seats-votes">
        <div id="controls">
          <label>df:
            <input value={df} onChange={(e) => this.setState({df: e.target.value})} />
          </label>
          <label>mmd:
            <input value={mmd} onChange={(e) => this.setState({mmd: e.target.value})} />
          </label>
          <label>width:
            <input value={width} onChange={(e) => this.setState({width: e.target.value})} />
          </label>
        </div>

        <VictoryChart
          domain={{x: [0, 1], y: [0, 1]}}>
          <VictoryScatter
            data={results}
            size={1}
            style={{ data: { fill: '#aaa', opacity: 0.5} }}/>
          <VictoryLine
            data={Tdiscrete}
            style={{ data: { stroke: '#e00' } }} />
          <VictoryAxis label="Vote Share"/>
          <VictoryAxis dependentAxis label="Seat Share" />
        </VictoryChart>
      </div>
    );
  }
}