import React, {Component} from 'react';
import {VictoryChart, VictoryAxis, VictoryScatter, VictoryLine} from 'victory';
import { TDistribution } from 'js-stats';

import SEATSVOTES from './sv_stats.json';

export default class SeatsVotes extends Component {
  constructor(props) {
    super(props)

    this.state = {
      df: 3,
      mmd: 0.03,
      width: 0.15,
      year: '2016',
      ndists: 10
    }
  }

  render() {
    const {df, mmd, width, year, ndists} = this.state;
    const stats = SEATSVOTES[ndists][year];

    const means = stats.map(({mean, std}, i) => ({x: i/1000, y: mean}))
    const his = stats.map(({mean, std}, i) => ({x: i/1000, y: mean + std}))
    const los = stats.map(({mean, std}, i) => ({x: i/1000, y: mean - std}))

    // Build a discrete line from the TDistribution
    const T = new TDistribution(df);

    const votesToSeats = (voteshare) => T.cumulativeProbability((voteshare - mmd - 0.5) / width);
    const Tdiscrete = Array.from({length: 1000}, (x,i) => i/1000).map((x) => ({x: x, y: votesToSeats(x)}));

    return (
      <div id="seats-votes" style={{textAlign: 'center', width: '75%', margin: 'auto'}}>
        <div id="controls">
          <div>year:
            {['2012', '2014', '2016'].map((y) => 
              <button disabled={year == y} onClick={() => this.setState({year: y})}>{y}</button>
            )}
          </div>
          <div>ndists:
            {['6', '7', '8', '9', '10', '11', '12', '13', '14', '15', '16', '17', '18', '19', '20'].map((n) => 
              <button disabled={ndists == n} onClick={() => this.setState({ndists: n})}>{n}</button>
            )}
          </div>
          <label>df:
            <input value={df} onChange={(e) => !isNaN(parseInt(e.target.value)) && this.setState({df: parseInt(e.target.value)})} />
          </label>
          <label>mmd:
            <input value={mmd} onChange={(e) => this.setState({mmd: e.target.value})} />
          </label>
          <label>width:
            <input value={width} onChange={(e) => this.setState({width: e.target.value})} />
          </label>
        </div>
        <div style={{margin: '1em'}}>50% Vote Share = {(100*(stats[499].mean/2 + stats[500].mean/2)).toFixed(2)}% Seat Share</div>
        <VictoryChart height={300}
          domain={{x: [0.1, 0.9], y: [0.1, 0.9]}}>
          <VictoryScatter data={means} size={1} style={{ data: { fill: '#e00', opacity: 0.3 } }}/>
          <VictoryScatter data={his} size={1} style={{ data: { fill: '#00b', opacity: 0.3 } }}/>
          <VictoryScatter data={los} size={1} style={{ data: { fill: '#00b', opacity: 0.3 } }}/>
          <VictoryLine
            data={Tdiscrete}
            style={{ data: { stroke: '#000' } }} />
          <VictoryAxis label="Vote Share"/>
          <VictoryAxis dependentAxis label="Seat Share" />
        </VictoryChart>
      </div>
    );
  }
}