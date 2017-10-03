import React, { Component } from 'react';
import apiGet from 'api/api';
import computeStats from 'helpers/main';
import ContentBlock from 'components/ContentBlock';
import 'style.styl';

export default class Root extends Component {
  // We wait for the data coming from the API
  constructor() {
    super();
    this.state = {
      stats: null
    };
    this.pastLaunches = null;
    this.upcomingLaunches = null;
  }

  componentWillMount() {
    // Wait for the two datasets to be loaded then compute the stats
    apiGet('/launches').then((response) => {
      this.pastLaunches = JSON.parse(response.text);
      if (this.upcomingLaunches !== null) {
        this.setState({stats: computeStats(this.pastLaunches, this.upcomingLaunches)});
      }
    });

    apiGet('/launches/upcoming').then((response) => {
      this.upcomingLaunches = JSON.parse(response.text);
      if (this.pastLaunches !== null) {
        this.setState({stats: computeStats(this.pastLaunches, this.upcomingLaunches)});
      }
    });
  }

  render() {
    if (!this.state.stats) {
      return <div />;
    }

    return (
      <div>
        <ContentBlock
          titlePrefix="Next Launch"
          backgroundImage="dscovrlaunch.jpg"
          stats={this.state.stats.nextLaunch} />

        <ContentBlock
          titlePrefix="Launch Count"
          backgroundImage="seslaunch.jpg"
          stats={this.state.stats.launchCount} />

        <ContentBlock
          titlePrefix="Launch History"
          backgroundImage="orbcommliftoff.jpg"
          stats={this.state.stats.launchHistory} />
      </div>
    );
  }
}
