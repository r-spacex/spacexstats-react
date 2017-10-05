import React, { Component } from 'react';
import { goToAnchor } from 'react-scrollable-anchor';

import ContentBlock from 'components/ContentBlock';
import apiGet from 'api/api';
import computeStats from 'helpers/main';
import 'fonts.styl';
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
          stats={this.state.stats.turnarounds} />

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

        <footer className="ContentBlock ContentBlock--footer" style={{backgroundImage: 'url(/img/backgrounds/orbcommdark.jpg)'}}>
          <main className="fx-col fx-middle-xs fx-center-xs text-center full-height">
            <p className="fx-col-xs">
                Photos on this page courtesy SpaceX, &amp; NASA. All rights maintained by the respective owners.<br />
                This site is fan-run and not affiliated with SpaceX in any way. For official information and news, please visit <a href="http://spacex.com" title="Official SpaceX website">spacex.com</a><br />
                Original site concept and design by <a href="https://www.reddit.com/user/EchoLogic" title="Echologic's Reddit profile">/u/EchoLogic</a>, now rehosted by <a href="https://www.reddit.com/user/brandtamos" title="Brandtamos' Reddit profile">/u/brandtamos</a> and recoded with React and <a href="https://github.com/r-spacex/SpaceX-API" title="r/spacex's API">r/spacex's API</a>.<br /><br />
                <a href="https://github.com/r-spacex/spacexstats-react" title="Contribute!">GitHub repository</a>
            </p>
          </main>
        </footer>

        <div className="hidden">
          {imagesToPreload.map((img, index) => (
            <img key={index} src={img} />
          ))}
        </div>
      </div>
    );
  }
}
