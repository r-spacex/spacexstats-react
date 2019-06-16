import React, { Component, Fragment } from 'react';

import ReactGA from 'react-ga';
import { connect } from 'react-redux';

import Footer from 'blocks/Footer';
import StyleReset from 'components/StyleReset';
import { apiGet, isInViewport, updateHash } from 'utils';
import { actions } from 'redux/duck';

ReactGA.initialize('UA-108091199-1');

class Root extends Component {
  constructor(props) {
    super(props);

    this.state = {
      launchesData: { pastLaunches: null, upcomingLaunches: null },
      currentTabs: {
        landing: null,
        launchCount: null,
        launchHistory: null,
        launchPads: null,
        reuse: null,
        turnarounds: null,
        upcoming: null
      }
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
  }

  componentWillMount() {
    // Wait for the two datasets to be loaded then compute the stats
    Promise.all([apiGet('/launches'), apiGet('/launches/upcoming')]).then(values => {
      this.setState(
        {
          launchesData: { pastLaunches: values[0], upcomingLaunches: values[1] }
        },
        () => {
          const { navigateTo } = this.props;

          setTimeout(() => {
            if (window.location.hash !== '') {
              const anchor = window.location.hash.replace('#', '');
              navigateTo(anchor, true);
            }
          }, 1000);

          window.addEventListener('scroll', () => {
            updateHash(this.scrollSpy());
          });
        }
      );
    });

    ReactGA.pageview('/');
  }

  updateHash = () => {
    if (window.history.pushState) {
      window.history.pushState(null, null, `#${this.currentAnchor}`);
    }
  };

  // Update the current anchor
  scrollSpy = () => {
    for (let i = 0; i < this.anchors.length; i++) {
      const testAnchor = this.anchors[i];
      if (isInViewport(testAnchor)) {
        this.currentAnchor = testAnchor;
      }
    }
  };

  moveTo = (targetAnchor, down = false) => {
    scrollTo(targetAnchor);
    this.updateHash();

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

    return (
      <Fragment>
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
          onMoveDown={this.moveDown}
          onMoveUp={this.moveUp}
          stats={stats.timelines}
        />
        <Footer />
      </Fragment>
    );
  }
}

const mapDispatchToProps = dispatch => ({
  navigateTo: (anchor, down) => dispatch(actions.navigateTo(anchor, down))
});

const RootContainer = connect(
  null,
  mapDispatchToProps
)(Root);

export default RootContainer;
