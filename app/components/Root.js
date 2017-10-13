import React, { Component } from 'react';
import ReactGA from 'react-ga';
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
    ReactGA.pageview('/');
  }

  moveTo = (targetAnchor, down = false) => {
    goToAnchor(targetAnchor);
    ReactGA.event({
      category: 'Scroll Arrow',
      action: down ? 'Scroll down' : 'Scroll up',
      label: targetAnchor,
    });
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
          onMoveDown={() => { this.moveTo('launchhistory', true); }}
          stats={this.state.stats.launchCount} />

        <ContentBlock
          titlePrefix="Launch History"
          backgroundImage="orbcommliftoff.jpg"
          anchor="launchhistory"
          onMoveUp={() => { this.moveTo('launchcount'); }}
          onMoveDown={() => { this.moveTo('reuse', true); }}
          stats={this.state.stats.launchHistory} />

        <ContentBlock
          titlePrefix="Reuse History"
          backgroundImage="crs6barge.jpg"
          anchor="reuse"
          onMoveUp={() => { this.moveTo('launchhistory'); }}
          onMoveDown={() => { this.moveTo('launchpads', true); }}
          stats={this.state.stats.reuseHistory} />

        <ContentBlock
          titlePrefix="Launch Pads"
          backgroundImage="capeflorida.jpg"
          anchor="launchpads"
          onMoveUp={() => { this.moveTo('reuse'); }}
          onMoveDown={() => { this.moveTo('turnarounds', true); }}
          stats={this.state.stats.launchpadCount} />

        <ContentBlock
          titlePrefix="Turnarounds"
          backgroundImage="thaicomlaunch.jpg"
          anchor="turnarounds"
          onMoveUp={() => { this.moveTo('launchpads'); }}
          onMoveDown={() => { this.moveTo('dragon', true); }}
          stats={this.state.stats.turnarounds} />

        <ContentBlock
          titlePrefix="Dragon"
          backgroundImage="dragoncrs5.jpg"
          anchor="dragon"
          onMoveUp={() => { this.moveTo('turnarounds'); }}
          onMoveDown={() => { this.moveTo('payloads', true); }}
          stats={this.state.stats.dragon} />

        <ContentBlock
          titlePrefix="Payloads"
          backgroundImage="payloadfairing.jpg"
          anchor="payloads"
          onMoveUp={() => { this.moveTo('dragon'); }}
          onMoveDown={() => { this.moveTo('people', true); }}
          stats={this.state.stats.payloads} />

        <ContentBlock
          titlePrefix="People"
          backgroundImage="dragonriders.jpg"
          anchor="people"
          onMoveUp={() => { this.moveTo('payloads'); }}
          onMoveDown={() => { this.moveTo('timelines', true); }}
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
                Photos on this page courtesy SpaceX, &amp; NASA. All rights maintained by the respective owners.<br/>

                This site is fan-run and not affiliated with SpaceX in any way. For official information and news, please visit
                <ReactGA.OutboundLink
                  eventLabel="Exit to SpaceX official website"
                  to="http://www.spacex.com" title="Official SpaceX website">
                  www.spacex.com
                </ReactGA.OutboundLink>
                <br/>

                Original site concept and design by
                <ReactGA.OutboundLink
                  eventLabel="Exit to EchoLogic's profile"
                  to="https://www.reddit.com/user/EchoLogic" title="Echologic's Reddit profile">
                  /u/EchoLogic
                </ReactGA.OutboundLink>,
                now rehosted by
                <ReactGA.OutboundLink
                  eventLabel="Exit to Brandtamos' profile"
                  to="https://www.reddit.com/user/brandtamos" title="Brandtamos' Reddit profile">
                  /u/brandtamos
                </ReactGA.OutboundLink>
                and recoded by
                <ReactGA.OutboundLink
                  eventLabel="Exit to kornelord's profile"
                  to="https://www.reddit.com/user/kornelord" title="kornelord's Reddit profile">
                  /u/kornelord
                </ReactGA.OutboundLink>
                with React and
                <ReactGA.OutboundLink
                  eventLabel="Exit to r/spacex's API"
                  to="https://github.com/r-spacex/SpaceX-API" title="r/spacex's API">
                  r/spacex's API
                </ReactGA.OutboundLink>.

                <br/><br/>

                <ReactGA.OutboundLink
                  eventLabel="Exit to Github Repo"
                  to="https://github.com/r-spacex/spacexstats-react" title="Contribute!">
                  GitHub repository
                </ReactGA.OutboundLink>
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
