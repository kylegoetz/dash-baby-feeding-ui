import React, { Component } from 'react';
import BigCalendar from 'react-big-calendar';
import moment from 'moment';
import logo from './logo.svg';
import './App.css';
import datetime from 'node-datetime';
import Cluster from './modules/clustering';

import 'react-big-calendar/lib/css/react-big-calendar.css';

BigCalendar.setLocalizer(BigCalendar.momentLocalizer(moment));

class App extends Component {
	constructor() {
		super();
		this.state = {
			events: []
	  };
	}

	componentDidMount() {
		fetch('/api/v1.0/baby-feeding/clicks')
		.then(res => res.json())
		.then(clicks => {
			const cluster = new Cluster(clicks.map(click => ({ id: click.id, createdAt: new Date(click.createdAt)})));
			return cluster.cluster().map(c => ({
				title: 'Feeding',
				start: new Date(c.min),
				end: c.range === 0 ? new Date(c.max.getTime()+30*60*1000) : c.max
			}));
		})
		.then(events => this.setState({events}));
	}

  render() {
    return (
      <div className="App">
        <div className="App-header">
          <h2>Feedings</h2>
        </div>
		<BigCalendar
		  {...this.props}
		  events={this.state.events}
		  defaultView='week'

		/>
      </div>
    );
  }
}

export default App;
