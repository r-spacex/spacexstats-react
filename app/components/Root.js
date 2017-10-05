import React, { Component } from 'react';
import { goToAnchor } from 'react-scrollable-anchor';

import ContentBlock from 'components/ContentBlock';
import apiGet from 'api/api';
import computeStats from 'helpers/main';
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

  moveTo = (targetAnchor) => {
    goToAnchor(targetAnchor);
  };

  render() {
    if (!this.state.stats) {
      return <div />;
    }

    // Preload all images from non-open tabs
    const imagesToPreload = [];
    for (const key in this.state.stats) {
      if (!this.state.stats.hasOwnProperty(key)) continue;

      const statBlock = this.state.stats[key];
      for (let i = 0; i < statBlock.length; i++) {
        if (statBlock[i].background) {
          imagesToPreload.push(`img/backgrounds/${statBlock[i].background}`);
        }
      }
    }

    return (
      <div>
        <ContentBlock
          titlePrefix="Next Launch"
          backgroundImage="dscovrlaunch.jpg"
          anchor="nextlaunch"
          onMoveDown={() => { this.moveTo('launchcount'); }}
          stats={this.state.stats.nextLaunch} />

        <ContentBlock
          titlePrefix="Launch Count"
          backgroundImage="seslaunch.jpg"
          anchor="launchcount"
          onMoveUp={() => { this.moveTo('nextlaunch'); }}
          onMoveDown={() => { this.moveTo('launchhistory'); }}
          stats={this.state.stats.launchCount} />

        <ContentBlock
          titlePrefix="Launch History"
          backgroundImage="orbcommliftoff.jpg"
          anchor="launchhistory"
          onMoveUp={() => { this.moveTo('launchcount'); }}
          onMoveDown={() => { this.moveTo('reuse'); }}
          stats={this.state.stats.launchHistory} />

        <ContentBlock
          titlePrefix="Reuse History"
          backgroundImage="crs6barge.jpg"
          anchor="reuse"
          onMoveUp={() => { this.moveTo('launchhistory'); }}
          onMoveDown={() => { this.moveTo('launchpads'); }}
          stats={this.state.stats.reuseHistory} />

        <ContentBlock
          titlePrefix="Launch Pads"
          backgroundImage="capeflorida.jpg"
          anchor="launchpads"
          onMoveUp={() => { this.moveTo('reuse'); }}
          onMoveDown={() => { this.moveTo('turnarounds'); }}
          stats={this.state.stats.launchpadCount} />

        <ContentBlock
          titlePrefix="Turnarounds"
          backgroundImage="thaicomlaunch.jpg"
          anchor="turnarounds"
          onMoveUp={() => { this.moveTo('launchpads'); }}
          onMoveDown={() => { this.moveTo('dragon'); }}
          stats={this.state.stats.launchHistory} />

        <ContentBlock
          titlePrefix="Dragon"
          backgroundImage="dragoncrs5.jpg"
          anchor="dragon"
          onMoveUp={() => { this.moveTo('turnarounds'); }}
          onMoveDown={() => { this.moveTo('payloads'); }}
          stats={this.state.stats.launchHistory} />

        <ContentBlock
          titlePrefix="Payloads"
          backgroundImage="payloadfairing.jpg"
          anchor="payloads"
          onMoveUp={() => { this.moveTo('dragon'); }}
          onMoveDown={() => { this.moveTo('people'); }}
          stats={this.state.stats.launchHistory} />

        <ContentBlock
          titlePrefix="People"
          backgroundImage="dragonriders.jpg"
          anchor="people"
          onMoveUp={() => { this.moveTo('payloads'); }}
          onMoveDown={() => { this.moveTo('timelines'); }}
          stats={this.state.stats.people} />

        <ContentBlock
          titlePrefix="Timelines"
          backgroundImage="elonmusk.jpg"
          anchor="timelines"
          onMoveUp={() => { this.moveTo('people'); }}
          stats={this.state.stats.timelines} />

        <div className="hidden">
          {imagesToPreload.map((img, index) => (
            <img key={index} src={img} />
          ))}
        </div>
      </div>
    );
  }
}
