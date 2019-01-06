import zoom from 'chartjs-plugin-zoom';
import * as hammer from 'hammerjs'; // eslint-disable-line no-unused-vars
import format from 'date-fns/format';
import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { Bar, Chart, Doughnut, Line } from 'react-chartjs-2';
import ScrollableAnchor, { configureAnchors } from 'react-scrollable-anchor';
import { Shortcuts } from 'react-shortcuts';

import IntegerStat from '~/components/stats/IntegerStat';
import TextStat from '~/components/stats/TextStat';
import TimeStat from '~/components/stats/TimeStat';
import Navbar from '~/components/Navbar';
import Ribbon from '~/components/Ribbon';
import { fromUnix, isInViewport } from '~/utils';

import './ContentBlock.styl';

class ContentBlock extends Component {
  constructor(props) {
    super(props);
    this.state = {
      currentStat: props.stats[0]
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

  onNavbarChange = tab => {
    const { stats } = this.props;
    for (let i = 0; i < stats.length; i++) {
      const stat = stats[i];
      if (tab === stat.tabTitle) {
        this.setState({ currentStat: stat });
      }
    }
  };

  moveLeft = () => {
    const { anchor, stats } = this.props;
    const { currentStat } = this.state;

    if (isInViewport(anchor)) {
      const index = stats.indexOf(currentStat);
      if (index > 0) {
        this.onNavbarChange(stats[index - 1].tabTitle);
      }
    }
  };

  moveRight = () => {
    const { anchor, stats } = this.props;
    const { currentStat } = this.state;

    if (isInViewport(anchor)) {
      const index = stats.indexOf(currentStat);
      if (index + 1 < stats.length) {
        this.onNavbarChange(stats[index + 1].tabTitle);
      }
    }
  };

  handleShortcuts = action => {
    switch (action) {
      case 'MOVE_LEFT':
        this.moveLeft();
        break;
      case 'MOVE_RIGHT':
        this.moveRight();
        break;
      default:
        break;
    }
  };

  render() {
    const { anchor, backgroundImage, onMoveUp, onMoveDown, titlePrefix } = this.props;
    const { currentStat: stat } = this.state;
    let statcomponent;

    // We need to clone the dataset because ChartJS will do some work on them
    const dataset = JSON.parse(JSON.stringify(stat.data));
    switch (stat.type) {
      case 'countdown':
        if (dataset === null) {
          statcomponent = <TextStat data="TBD" />;
          break;
        }
        statcomponent = <TimeStat data={dataset} type={stat.type} />;
        break;

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
        if (typeof stat.type === 'function') {
          statcomponent = <stat.type data={stat.data} />;
        } else {
          statcomponent = 'Nothing to display';
        }
    }

    // Exception: add ribbon for the next launch section (launch datetime)
    let ribbonText = null;

    if (stat.tabTitle === 'Next Launch' && dataset !== null) {
      ribbonText = format(fromUnix(stat.data), 'MMM Do, h:mm:ssa (UTC)');
    }

    const background = stat.background ? stat.background : backgroundImage;

    return (
      <Shortcuts name="TABS" handler={this.handleShortcuts} global targetNodeSelector="body">
        <article
          id={`section-${anchor}`}
          className="ContentBlock"
          style={{ backgroundImage: `url(img/backgrounds/${background})` }}
        >
          <ScrollableAnchor id={anchor}>
            <span />
          </ScrollableAnchor>
          <div className="fx-container" style={{ minHeight: '100vh' }}>
            <div className="fx-col" style={{ minHeight: '100vh' }}>
              <header className="ContentBlock__titleWrapper fx-col fx-center-xs padded">
                <h2 className="ContentBlock__title">
                  {titlePrefix} - {stat.title}
                </h2>
              </header>

              <section className="ContentBlock__statWrapper fx-grow fx-col">
                {onMoveUp && (
                  <i
                    className="ContentBlock__control ContentBlock__control--up fa fa-angle-up large"
                    onClick={onMoveUp}
                    onKeyUp={onMoveUp}
                    role="button"
                    tabIndex="0"
                  />
                )}

                {ribbonText && (
                  <div title="The launch time converted in your time zone">
                    <Ribbon text={ribbonText} />
                  </div>
                )}

                <Navbar tabs={this.navbarTabs} onChangeCallback={this.onNavbarChange} selectedTab={stat.tabTitle} />

                <div className="ContentBlock__stat fx-grow fx-row fx-center-xs fx-middle-xs mtop-big">
                  {statcomponent}
                </div>

                {stat.text && <div className="ContentBlock__text padded mtop-big">{stat.text}</div>}

                {onMoveDown && (
                  <i
                    className="ContentBlock__control ContentBlock__control--down fa fa-angle-down large"
                    onClick={onMoveDown}
                    onKeyUp={onMoveDown}
                    role="button"
                    tabIndex="0"
                  />
                )}
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
  onMoveUp: null
};

ContentBlock.propTypes = {
  titlePrefix: PropTypes.string.isRequired,
  backgroundImage: PropTypes.string.isRequired,
  stats: PropTypes.arrayOf(PropTypes.object).isRequired,
  anchor: PropTypes.string.isRequired,
  onMoveUp: PropTypes.func,
  onMoveDown: PropTypes.func
};

export default ContentBlock;
