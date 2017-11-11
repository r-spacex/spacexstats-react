import React, { Component } from 'react';
import ReactGA from 'react-ga';
import PropTypes from 'prop-types';
import ScrollableAnchor, { goToAnchor } from 'react-scrollable-anchor';
import { Shortcuts, ShortcutManager } from 'react-shortcuts';

import ContentBlock from 'components/ContentBlock';
import apiGet from 'api';
import computeStats from 'helpers/main';
import utils from 'utils';
import keymap from 'keymap';

import 'style.styl';

const shortcutManager = new ShortcutManager(keymap);

class Root extends Component {
  // We wait for the data coming from the API
  constructor() {
    super();
    this.state = {
      stats: null
    };
    this.pastLaunches = null;
    this.upcomingLaunches = null;
    this.anchors = [
      'nextlaunch',
      'launchcount',
      'launchhistory',
      'landing',
      'reuse',
      'launchpads',
      'turnarounds',
      'dragon',
      'payloads',
      'people',
      'timelines',
      'infos',
    ];
    this.currentAnchor = this.anchors[0];
  }

  getChildContext() {
    return { shortcuts: shortcutManager };
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

  // Update the current anchor
  scrollSpy = () => {
    for (let i = 0; i < this.anchors.length; i++) {
      const testAnchor = this.anchors[i];
      if (utils.isInViewport(testAnchor)) {
        this.currentAnchor = testAnchor;
      }
    }
  };

  handleShortcuts = (action) => {
    switch (action) {
      case 'MOVE_UP':
        this.moveUp();
        break;
      case 'MOVE_DOWN':
        this.moveDown();
        break;
      default: break;
    }
  }

  moveTo = (targetAnchor, down = false) => {
    goToAnchor(targetAnchor);
    ReactGA.event({
      category: 'Scroll Arrow',
      action: down ? 'Scroll down' : 'Scroll up',
      label: targetAnchor,
    });
  };

  moveDown = () => {
    this.scrollSpy();
    const i = this.anchors.indexOf(this.currentAnchor);
    if (i + 1 < this.anchors.length) {
      this.moveTo(this.anchors[i + 1], true);
    }
  };

  moveUp = () => {
    this.scrollSpy();
    const i = this.anchors.indexOf(this.currentAnchor);
    if (i - 1 >= 0) {
      this.moveTo(this.anchors[i - 1]);
    }
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
        <Shortcuts name="NAVIGATION" handler={this.handleShortcuts} global>
          <ContentBlock
            titlePrefix="Next Launch"
            backgroundImage="dscovrlaunch.jpg"
            anchor={this.anchors[0]}
            onMoveDown={this.moveDown}
            stats={this.state.stats.nextLaunch} />

          <ContentBlock
            titlePrefix="Launch Count"
            backgroundImage="seslaunch.jpg"
            anchor={this.anchors[1]}
            onMoveDown={this.moveDown}
            onMoveUp={this.moveUp}
            stats={this.state.stats.launchCount} />

          <ContentBlock
            titlePrefix="Launch History"
            backgroundImage="orbcommliftoff.jpg"
            anchor={this.anchors[2]}
            onMoveDown={this.moveDown}
            onMoveUp={this.moveUp}
            stats={this.state.stats.launchHistory} />

          <ContentBlock
            titlePrefix="Landing History"
            backgroundImage="crs6barge.jpg"
            anchor={this.anchors[3]}
            onMoveDown={this.moveDown}
            onMoveUp={this.moveUp}
            stats={this.state.stats.landingHistory} />

          <ContentBlock
            titlePrefix="Reuse History"
            backgroundImage="reuse.jpg"
            anchor={this.anchors[4]}
            onMoveDown={this.moveDown}
            onMoveUp={this.moveUp}
            stats={this.state.stats.reuseHistory} />

          <ContentBlock
            titlePrefix="Launch Pads"
            backgroundImage="capeflorida.jpg"
            anchor={this.anchors[5]}
            onMoveDown={this.moveDown}
            onMoveUp={this.moveUp}
            stats={this.state.stats.launchpadCount} />

          <ContentBlock
            titlePrefix="Turnarounds"
            backgroundImage="thaicomlaunch.jpg"
            anchor={this.anchors[6]}
            onMoveDown={this.moveDown}
            onMoveUp={this.moveUp}
            stats={this.state.stats.turnarounds} />

          <ContentBlock
            titlePrefix="Dragon"
            backgroundImage="dragoncrs5.jpg"
            anchor={this.anchors[7]}
            onMoveDown={this.moveDown}
            onMoveUp={this.moveUp}
            stats={this.state.stats.dragon} />

          <ContentBlock
            titlePrefix="Payloads"
            backgroundImage="payloadfairing.jpg"
            anchor={this.anchors[8]}
            onMoveDown={this.moveDown}
            onMoveUp={this.moveUp}
            stats={this.state.stats.payloads} />

          <ContentBlock
            titlePrefix="People"
            backgroundImage="dragonriders.jpg"
            anchor={this.anchors[9]}
            onMoveDown={this.moveDown}
            onMoveUp={this.moveUp}
            stats={this.state.stats.people} />

          <ContentBlock
            titlePrefix="Timelines"
            backgroundImage="elonmusk.jpg"
            anchor={this.anchors[10]}
            onMoveUp={this.moveUp}
            stats={this.state.stats.timelines} />

          <footer id="section-infos" className="ContentBlock ContentBlock--footer" style={{backgroundImage: 'url(/img/backgrounds/orbcommdark.jpg)'}}>
            <ScrollableAnchor id="infos"><span /></ScrollableAnchor>
            <main className="fx-col fx-middle-xs fx-center-xs text-center full-height">
              <p className="fx-col-xs">
                  Photos on this page courtesy SpaceX, &amp; NASA. All rights maintained by the respective owners.<br/>

                  This site is fan-run and not affiliated with SpaceX in any way. For official information and news, please visit&nbsp;
                  <ReactGA.OutboundLink
                    eventLabel="Exit to SpaceX official website"
                    to="http://www.spacex.com" title="Official SpaceX website">
                    www.spacex.com
                  </ReactGA.OutboundLink>.
                  <br/>

                  Original site concept and design by&nbsp;
                  <ReactGA.OutboundLink
                    eventLabel="Exit to EchoLogic's profile"
                    to="https://www.reddit.com/user/EchoLogic" title="Echologic's Reddit profile">
                    /u/EchoLogic
                  </ReactGA.OutboundLink>,
                  &nbsp;now rehosted by&nbsp;
                  <ReactGA.OutboundLink
                    eventLabel="Exit to Brandtamos' profile"
                    to="https://www.reddit.com/user/brandtamos" title="Brandtamos' Reddit profile">
                    /u/brandtamos
                  </ReactGA.OutboundLink>
                  &nbsp;and recoded by&nbsp;
                  <ReactGA.OutboundLink
                    eventLabel="Exit to kornelord's profile"
                    to="https://www.reddit.com/user/kornelord" title="kornelord's Reddit profile">
                    /u/kornelord
                  </ReactGA.OutboundLink>
                  &nbsp;with React and&nbsp;
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
        </Shortcuts>
      </div>
    );
  }
}

Root.childContextTypes = {
  shortcuts: PropTypes.object.isRequired
};

export default Root;
