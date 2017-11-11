import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Bar, Chart, Doughnut, Line } from 'react-chartjs-2';
import ScrollableAnchor, { configureAnchors } from 'react-scrollable-anchor';
import { Shortcuts } from 'react-shortcuts';
import moment from 'moment';
import zoom from 'chartjs-plugin-zoom';
import * as hammer from 'hammerjs'; // eslint-disable-line

import utils from 'utils';
import Navbar from 'components/Navbar';
import Ribbon from 'components/Ribbon';
import IntegerStat from 'components/stats/IntegerStat';
import TextStat from 'components/stats/TextStat';
import TimeStat from 'components/stats/TimeStat';


class ContentBlock extends Component {
  constructor(props) {
    super(props);
    this.state = {
      currentStat: props.stats[0],
    };

    this.navbarTabs = [];
    for (const stat of props.stats) {
      this.navbarTabs.push(stat.tabTitle);
    }
  }

  componentWillMount() {
    Chart.plugins.register(zoom);
    configureAnchors({ keepLastAnchorHash: true });
  }

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

  moveLeft = () => {
    if (utils.isInViewport(this.props.anchor)) {
      const index = this.props.stats.indexOf(this.state.currentStat);
      if (index > 0) {
        this.onNavbarChange(this.props.stats[index - 1].tabTitle);
      }
    }
  };

  moveRight = () => {
    if (utils.isInViewport(this.props.anchor)) {
      const index = this.props.stats.indexOf(this.state.currentStat);
      if (index + 1 < this.props.stats.length) {
        this.onNavbarChange(this.props.stats[index + 1].tabTitle);
      }
    }
  };

  onNavbarChange = (tab) => {
    for (const stat of this.props.stats) {
      if (tab === stat.tabTitle) {
        this.setState({ currentStat: stat });
      }
    }
  }

  render() {
    let statcomponent;

    // We need to clone the dataset because ChartJS will do some work on them
    const dataset = JSON.parse(JSON.stringify(this.state.currentStat.data));
    switch (this.state.currentStat.type) {
      case 'countdown':
      case 'timer':
      case 'duration':
        statcomponent = <TimeStat data={dataset} type={this.state.currentStat.type} />;
        break;

      case 'integer':
        statcomponent = <IntegerStat data={dataset} />;
        break;

      case 'text':
        statcomponent = <TextStat data={dataset} />;
        break;

      case 'barchart':
        statcomponent = <Bar data={dataset} options={this.state.currentStat.options} />;
        break;

      case 'line':
        statcomponent = <Line data={dataset} options={this.state.currentStat.options} />;
        break;

      case 'piechart':
        statcomponent = <Doughnut data={dataset} options={this.state.currentStat.options} />;
        break;

      default:
        statcomponent = 'Nothing to display';
    }

    // Exception: add ribbon for the next launch section (launch datetime)
    let ribbonText = null;
    if (this.props.anchor === 'nextlaunch') {
      ribbonText = moment.unix(this.state.currentStat.data).format('MMM Do, h:mm:ssa (UTCZ)');
    }

    const background = this.state.currentStat.background ? this.state.currentStat.background : this.props.backgroundImage;

    return (
      <Shortcuts name="TABS" handler={this.handleShortcuts} global targetNodeSelector="body">
        <article id={`section-${this.props.anchor}`} className="ContentBlock" style={{backgroundImage: `url(img/backgrounds/${background})`}}>
          <ScrollableAnchor id={this.props.anchor}><span /></ScrollableAnchor>
          <div className="fx-container" style={{minHeight: '100vh'}}>
            <div className="fx-col" style={{minHeight: '100vh'}}>
              <header className="ContentBlock__titleWrapper fx-col fx-center-xs padded">
                <h2 className="ContentBlock__title">
                  {this.props.titlePrefix} - {this.state.currentStat.title}
                </h2>
              </header>

              <section className="ContentBlock__statWrapper fx-grow fx-col">
                {this.props.onMoveUp &&
                  <span className="ContentBlock__control ContentBlock__control--up fa fa-angle-up large"
                        onClick={this.props.onMoveUp}></span>
                }

                {ribbonText &&
                  <div title="The launch time converted in your time zone">
                    <Ribbon text={ribbonText} />
                  </div>
                }

                <Navbar tabs={this.navbarTabs} onChangeCallback={this.onNavbarChange} selectedTab={this.state.currentStat.tabTitle} />

                <div className="ContentBlock__stat fx-grow fx-row fx-center-xs fx-middle-xs mtop-big">
                  {statcomponent}
                </div>
                <div className="ContentBlock__text padded mtop-big">
                  {this.state.currentStat.text}
                </div>

                {this.props.onMoveDown &&
                  <span className="ContentBlock__control ContentBlock__control--down fa fa-angle-down large"
                        onClick={this.props.onMoveDown}></span>
                }
              </section>
            </div>
          </div>
        </article>
      </Shortcuts>
    );
  }
}

ContentBlock.propTypes = {
  titlePrefix: PropTypes.string.isRequired,
  backgroundImage: PropTypes.string.isRequired,
  stats: PropTypes.array.isRequired,
  anchor: PropTypes.string.isRequired,
  onMoveUp: PropTypes.func,
  onMoveDown: PropTypes.func,
};


ContentBlock.childContextTypes = {
  shortcuts: PropTypes.object.isRequired
};

export default ContentBlock;
