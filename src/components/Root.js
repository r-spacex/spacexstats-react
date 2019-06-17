import React, { Component, Fragment } from 'react';

import NProgress from 'nprogress';
import 'nprogress/nprogress.css';
import ReactGA from 'react-ga';
import { connect } from 'react-redux';

import {
  Dragon,
  Footer,
  Landing,
  LaunchCount,
  LaunchHistory,
  LaunchPads,
  Payloads,
  People,
  Reuse,
  Starlink,
  Starship,
  Timelines,
  Turnarounds,
  Upcoming
} from 'blocks';
import StyleReset from 'components/StyleReset';
import { apiGet, isInViewport, updateHash } from 'utils';
import { actions } from 'redux/duck';

class Root extends Component {
  constructor(props) {
    super(props);

    this.state = {
      launchesData: { pastLaunches: null, upcomingLaunches: null },
      currentTabs: {
        dragon: null,
        landing: null,
        launchCount: null,
        launchHistory: null,
        launchPads: null,
        payloads: null,
        people: null,
        reuse: null,
        starlink: null,
        starship: null,
        timelines: null,
        turnarounds: null,
        upcoming: null
      }
    };

    this.anchors = [
      'upcoming',
      'launchcount',
      'launchhistory',
      'launchpads',
      'landing',
      'reuse',
      'turnarounds',
      'payloads',
      'dragon',
      'people',
      'starlink',
      'starship',
      'timelines',
      'infos'
    ];
  }

  componentDidMount() {
    NProgress.configure({ minimum: 0, trickle: false, showSpinner: false });
    NProgress.start();

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
            this.updateProgressBar();
          });
        }
      );
    });

    ReactGA.initialize('UA-108091199-1');
    ReactGA.pageview('/');
  }

  updateProgressBar = () => {
    const { body, documentElement } = document;
    const scrollTop = 'scrollTop';
    const scrollHeight = 'scrollHeight';
    const scrollPercentage =
      (documentElement[scrollTop] || body[scrollTop]) /
      ((documentElement[scrollHeight] || body[scrollHeight]) - documentElement.clientHeight);

    NProgress.set(scrollPercentage);
  };

  // Get the current anchor
  scrollSpy = () => {
    for (let i = 0; i < this.anchors.length; i++) {
      const testAnchor = this.anchors[i];
      if (isInViewport(testAnchor)) {
        return testAnchor;
      }
    }
    return '';
  };

  changeTab = (section, tab) => {
    this.setState(prevState => ({ currentTabs: { ...prevState, [section]: tab } }));
  };

  render() {
    const { currentTabs, launchesData } = this.state;

    return (
      <Fragment>
        <StyleReset />

        <Upcoming
          currentTab={currentTabs.upcoming}
          changeTab={tab => this.changeTab('upcoming', tab)}
          {...launchesData}
        />

        <LaunchCount
          currentTab={currentTabs.launchCount}
          changeTab={tab => this.changeTab('launchCount', tab)}
          {...launchesData}
        />

        <LaunchHistory
          currentTab={currentTabs.launchHistory}
          changeTab={tab => this.changeTab('launchHistory', tab)}
          {...launchesData}
        />

        <LaunchPads
          currentTab={currentTabs.launchPads}
          changeTab={tab => this.changeTab('launchPads', tab)}
          {...launchesData}
        />

        <Landing currentTab={currentTabs.landing} changeTab={tab => this.changeTab('landing', tab)} {...launchesData} />

        <Reuse currentTab={currentTabs.reuse} changeTab={tab => this.changeTab('reuse', tab)} {...launchesData} />

        <Turnarounds
          currentTab={currentTabs.turnarounds}
          changeTab={tab => this.changeTab('turnarounds', tab)}
          {...launchesData}
        />

        <Payloads
          currentTab={currentTabs.payloads}
          changeTab={tab => this.changeTab('payloads', tab)}
          {...launchesData}
        />

        <Dragon currentTab={currentTabs.dragon} changeTab={tab => this.changeTab('dragon', tab)} {...launchesData} />

        <People currentTab={currentTabs.people} changeTab={tab => this.changeTab('people', tab)} {...launchesData} />

        <Starlink
          currentTab={currentTabs.starlink}
          changeTab={tab => this.changeTab('starlink', tab)}
          {...launchesData}
        />

        <Starship
          currentTab={currentTabs.starship}
          changeTab={tab => this.changeTab('starship', tab)}
          {...launchesData}
        />

        <Timelines
          currentTab={currentTabs.timelines}
          changeTab={tab => this.changeTab('timelines', tab)}
          {...launchesData}
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
