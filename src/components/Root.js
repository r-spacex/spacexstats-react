import PropTypes from 'prop-types';
import React, { Component } from 'react';

import ReactGA from 'react-ga';
import { goToAnchor } from 'react-scrollable-anchor';
import { Shortcuts, ShortcutManager } from 'react-shortcuts';

import Footer from 'blocks/Footer';
import StyleReset from 'components/StyleReset';
import computeStats from 'helpers/main';
import keymap from 'keymap';
import { apiGet, isInViewport } from 'utils';
import ContentBlock from './ContentBlock';

const shortcutManager = new ShortcutManager(keymap);

class Root extends Component {
  // We wait for the data coming from the API
  constructor() {
    super();
    this.state = {
      stats: null
    };
    this.anchors = [
      'upcoming',
      'launchcount',
      'launchhistory',
      'landing',
      'reuse',
      'launchpads',
      'turnarounds',
      'dragon',
      'payloads',
      'people',
      'starship',
      'timelines',
      'infos'
    ];
    this.currentAnchor = this.anchors[0]; // eslint-disable-line prefer-destructuring
  }

  getChildContext() {
    return { shortcuts: shortcutManager };
  }

  componentWillMount() {
    // Wait for the two datasets to be loaded then compute the stats
    Promise.all([apiGet('/launches'), apiGet('/launches/upcoming')]).then(values => {
      this.setState({
        stats: computeStats(JSON.parse(values[0].text), JSON.parse(values[1].text))
      });
    });

    ReactGA.pageview('/');
  }

  // Update the current anchor
  scrollSpy = () => {
    for (let i = 0; i < this.anchors.length; i++) {
      const testAnchor = this.anchors[i];
      if (isInViewport(testAnchor)) {
        this.currentAnchor = testAnchor;
      }
    }
  };

  handleShortcuts = action => {
    switch (action) {
      case 'MOVE_UP':
        this.moveUp();
        break;
      case 'MOVE_DOWN':
        this.moveDown();
        break;
      default:
        break;
    }
  };

  moveTo = (targetAnchor, down = false) => {
    goToAnchor(targetAnchor);
    ReactGA.event({
      category: 'Scroll Arrow',
      action: down ? 'Scroll down' : 'Scroll up',
      label: targetAnchor
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
    const { stats } = this.state;

    if (!stats) {
      return <div />;
    }

    // Preload all images from non-open tabs
    const imagesToPreload = [];
    const statsKeys = Object.keys(stats);
    for (let i = 0; i < statsKeys.length; i++) {
      const key = statsKeys[i];
      if (Object.prototype.hasOwnProperty.call(stats, key)) {
        const statBlock = stats[key];
        for (let j = 0; j < statBlock.length; j++) {
          if (statBlock[j].background) {
            imagesToPreload.push(`img/backgrounds/${statBlock[j].background}`);
          }
        }
      }
    }

    return (
      <Shortcuts name="NAVIGATION" handler={this.handleShortcuts} global>
        <StyleReset />
        <ContentBlock
          titlePrefix="Next Launches"
          backgroundImage="dscovrlaunch.jpg"
          anchor={this.anchors[0]}
          onMoveDown={this.moveDown}
          stats={stats.nextLaunch}
        />
        <ContentBlock
          titlePrefix="Launch Count"
          backgroundImage="seslaunch.jpg"
          anchor={this.anchors[1]}
          onMoveDown={this.moveDown}
          onMoveUp={this.moveUp}
          stats={stats.launchCount}
        />
        <ContentBlock
          titlePrefix="Launch History"
          backgroundImage="falconheavy.jpg"
          anchor={this.anchors[2]}
          onMoveDown={this.moveDown}
          onMoveUp={this.moveUp}
          stats={stats.launchHistory}
        />
        <ContentBlock
          titlePrefix="Landing History"
          backgroundImage="doublelanding.jpg"
          anchor={this.anchors[3]}
          onMoveDown={this.moveDown}
          onMoveUp={this.moveUp}
          stats={stats.landingHistory}
        />
        <ContentBlock
          titlePrefix="Reuse History"
          backgroundImage="reuse.jpg"
          anchor={this.anchors[4]}
          onMoveDown={this.moveDown}
          onMoveUp={this.moveUp}
          stats={stats.reuseHistory}
        />
        <ContentBlock
          titlePrefix="Launch Pads"
          backgroundImage="capeflorida.jpg"
          anchor={this.anchors[5]}
          onMoveDown={this.moveDown}
          onMoveUp={this.moveUp}
          stats={stats.launchpadCount}
        />
        <ContentBlock
          titlePrefix="Turnarounds"
          backgroundImage="thaicomlaunch.jpg"
          anchor={this.anchors[6]}
          onMoveDown={this.moveDown}
          onMoveUp={this.moveUp}
          stats={stats.turnarounds}
        />
        <ContentBlock
          titlePrefix="Dragon"
          backgroundImage="dragoncrs5.jpg"
          anchor={this.anchors[7]}
          onMoveDown={this.moveDown}
          onMoveUp={this.moveUp}
          stats={stats.dragon}
        />
        <ContentBlock
          titlePrefix="Payloads"
          backgroundImage="payloadfairing.jpg"
          anchor={this.anchors[8]}
          onMoveDown={this.moveDown}
          onMoveUp={this.moveUp}
          stats={stats.payloads}
        />
        <ContentBlock
          titlePrefix="People"
          backgroundImage="dragonriders.jpg"
          anchor={this.anchors[9]}
          onMoveDown={this.moveDown}
          onMoveUp={this.moveUp}
          stats={stats.people}
        />
        <ContentBlock
          titlePrefix="Starship"
          backgroundImage="bfrcargo.jpg"
          anchor={this.anchors[10]}
          onMoveDown={this.moveDown}
          onMoveUp={this.moveUp}
          stats={stats.starship}
        />
        <ContentBlock
          titlePrefix="Timelines"
          backgroundImage="elonmusk.jpg"
          anchor={this.anchors[11]}
          onMoveUp={this.moveUp}
          stats={stats.timelines}
        />
        <Footer />
        <div className="hidden">
          {imagesToPreload.map((img, index) => (
            <link key={index} itemProp="image" rel="preload" href={img} as="image" />
          ))}
        </div>
      </Shortcuts>
    );
  }
}

Root.childContextTypes = {
  /* eslint-disable-next-line */
  shortcuts: PropTypes.object.isRequired
};

export default Root;
