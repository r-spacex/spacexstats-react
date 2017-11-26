import zoom from 'chartjs-plugin-zoom';
import * as hammer from 'hammerjs'; // eslint-disable-line no-unused-vars
import moment from 'moment';
import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { Bar, Chart, Doughnut, Line } from 'react-chartjs-2';
import ScrollableAnchor, { configureAnchors } from 'react-scrollable-anchor';
import { Shortcuts } from 'react-shortcuts';

import IntegerStat from '~/components/stats/IntegerStat.jsx';
import TextStat from '~/components/stats/TextStat.jsx';
import TimeStat from '~/components/stats/TimeStat.jsx';
import Navbar from '~/components/Navbar.jsx';
import Ribbon from '~/components/Ribbon.jsx';
import { isInViewport } from '~/utils';

import './ContentBlock.styl';

class ContentBlock extends Component {
  constructor(props) {
    super(props);
    this.state = {
      currentStat: props.stats[0],
    };

    this.navbarTabs = [];
    for (let i = 0; i < props.stats.length; i++) {
      this.navbarTabs.push(props.stats[i].tabTitle);
    }
  }

  componentWillMount() {
    Chart.plugins.register(zoom);
    configureAnchors({ keepLastAnchorHash: true });
  }

  onNavbarChange = (tab) => {
    for (let i = 0; i < this.props.stats.length; i++) {
      const stat = this.props.stats[i];
      if (tab === stat.tabTitle) {
        this.setState({ currentStat: stat });
      }
    }
  }

  moveLeft = () => {
    if (isInViewport(this.props.anchor)) {
      const index = this.props.stats.indexOf(this.state.currentStat);
      if (index > 0) {
        this.onNavbarChange(this.props.stats[index - 1].tabTitle);
      }
    }
  };

  moveRight = () => {
    if (isInViewport(this.props.anchor)) {
      const index = this.props.stats.indexOf(this.state.currentStat);
      if (index + 1 < this.props.stats.length) {
        this.onNavbarChange(this.props.stats[index + 1].tabTitle);
      }
    }
  };

  handleShortcuts = (action) => {
    switch (action) {
      case 'MOVE_LEFT':
        this.moveLeft();
        break;
      case 'MOVE_RIGHT':
        this.moveRight();
        break;
      default: break;
    }
  }

  render() {
    let statcomponent;
    const stat = this.state.currentStat;

    // We need to clone the dataset because ChartJS will do some work on them
    const dataset = JSON.parse(JSON.stringify(stat.data));
    switch (stat.type) {
      case 'countdown':
      case 'timer':
      case 'duration':
        statcomponent = <TimeStat data={dataset} type={stat.type} />;
        break;

      case 'integer':
        statcomponent = <IntegerStat data={dataset} />;
        break;

      case 'text':
        statcomponent = <TextStat data={dataset} />;
        break;

      case 'barchart':
        statcomponent = <Bar data={dataset} options={stat.options} />;
        break;

      case 'line':
        statcomponent = <Line data={dataset} options={stat.options} />;
        break;

      case 'piechart':
        statcomponent = <Doughnut data={dataset} options={stat.options} />;
        break;

      default:
        statcomponent = 'Nothing to display';
    }

    // Exception: add ribbon for the next launch section (launch datetime)
    let ribbonText = null;
    if (this.props.anchor === 'nextlaunch') {
      ribbonText = moment.unix(stat.data).format('MMM Do, h:mm:ssa (UTCZ)');
    }

    const background = stat.background ? stat.background : this.props.backgroundImage;

    return (
      <Shortcuts name="TABS" handler={this.handleShortcuts} global targetNodeSelector="body">
        <article id={`section-${this.props.anchor}`} className="ContentBlock" style={{ backgroundImage: `url(img/backgrounds/${background})` }}>
          <ScrollableAnchor id={this.props.anchor}><span /></ScrollableAnchor>
          <div className="fx-container" style={{ minHeight: '100vh' }}>
            <div className="fx-col" style={{ minHeight: '100vh' }}>
              <header className="ContentBlock__titleWrapper fx-col fx-center-xs padded">
                <h2 className="ContentBlock__title">
                  {this.props.titlePrefix} - {stat.title}
                </h2>
              </header>

              <section className="ContentBlock__statWrapper fx-grow fx-col">
                {this.props.onMoveUp &&
                  <i className="ContentBlock__control ContentBlock__control--up fa fa-angle-up large" onClick={this.props.onMoveUp} onKeyUp={this.props.onMoveUp} role="button" tabIndex="0" />
                }

                {ribbonText &&
                  <div title="The launch time converted in your time zone">
                    <Ribbon text={ribbonText} />
                  </div>
                }

                <Navbar
                  tabs={this.navbarTabs}
                  onChangeCallback={this.onNavbarChange}
                  selectedTab={stat.tabTitle}
                />

                <div className="ContentBlock__stat fx-grow fx-row fx-center-xs fx-middle-xs mtop-big">
                  {statcomponent}
                </div>
                <div className="ContentBlock__text padded mtop-big">
                  {stat.text}
                </div>

                {this.props.onMoveDown &&
                  <i className="ContentBlock__control ContentBlock__control--down fa fa-angle-down large" onClick={this.props.onMoveDown} onKeyUp={this.props.onMoveDown} role="button" tabIndex="0" />
                }
              </section>
            </div>
          </div>
        </article>
      </Shortcuts>
    );
  }
}

ContentBlock.defaultProps = {
  onMoveDown: null,
  onMoveUp: null,
};

ContentBlock.propTypes = {
  titlePrefix: PropTypes.string.isRequired,
  backgroundImage: PropTypes.string.isRequired,
  stats: PropTypes.arrayOf(PropTypes.object).isRequired,
  anchor: PropTypes.string.isRequired,
  onMoveUp: PropTypes.func,
  onMoveDown: PropTypes.func,
};

export default ContentBlock;
