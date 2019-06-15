import zoom from 'chartjs-plugin-zoom';
import * as hammer from 'hammerjs'; // eslint-disable-line no-unused-vars
import format from 'date-fns/format';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import React, { Component } from 'react';
import ReactGA from 'react-ga';
import { Bar, Chart, Doughnut, Line } from 'react-chartjs-2';
import ScrollableAnchor, { configureAnchors } from 'react-scrollable-anchor';
import { Shortcuts } from 'react-shortcuts';

import IntegerStat from '~/components/stats/IntegerStat';
import TextStat from '~/components/stats/TextStat';
import TimeStat from '~/components/stats/TimeStat';
import Link from '~/components/Link';
import Navbar from '~/components/Navbar';
import Ribbon from '~/components/Ribbon';
import { fromUnix, isInViewport } from '~/utils';

import { colorUsages, fonts, thresholds } from '~/stylesheet';

export const Background = styled.article`
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;
  min-height: 100vh;
  overflow-x: hidden;

  background-size: cover;
  background-position: center center;
  transition: background-image 0.3s ease-in-out;
`;

export const Wrapper = styled.div`
  flex-grow: 1;
  display: flex;
  flex-direction: column;

  @media only screen and (min-width: ${thresholds.sm}) {
    width: ${thresholds.sm};
  }
  @media only screen and (min-width: ${thresholds.md}) {
    width: ${thresholds.md};
  }
  @media only screen and (min-width: ${thresholds.lg}) {
    width: ${thresholds.lg};
  }
`;

const Title = styled.h2`
  ${fonts.special}
  display: flex;
  align-items: center;

  height: 5rem;
  @media (min-width: ${thresholds.sm}) {
    font-size: 3rem;
    height: 10rem;
  }
`;

const Content = styled.div`
  flex-grow: 1;

  display: flex;
  flex-direction: column;
  position: relative;
  justify-content: center;

  min-height: 20rem;
  margin-bottom: 5rem;
  background-color: ${colorUsages.contentBackground};
  z-index: 0;

  /* Custom "shadow" border */
  &:after {
    z-index: -1;
    content: '';
    position: absolute;
    top: -3px;
    left: -3px;
    right: -3px;
    bottom: -3px;
    border: 3px solid ${colorUsages.contentShadow};
  }
`;

const Stat = styled.div`
  position: relative;
  padding: 1rem;
  flex-grow: 1;
  display: flex;
  flex-direction: column;
  justify-content: center;
`;

const Text = styled.div`
  min-height: 8rem; /* It can host 3 lines on normal conditions */
  padding: 2rem 1rem;
`;

const Control = styled.i`
  position: absolute;
  cursor: pointer;
  font-size: 3rem;
  right: 1rem;

  ${({ up }) => up && `top: -3rem`}
  ${({ down }) => down && `bottom: -3rem`}
`;

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
      ribbonText = format(fromUnix(stat.data), 'MMM Do, h:mm:ssa (UTCZ)');
    }

    const background = stat.background ? stat.background : backgroundImage;

    return (
      <Shortcuts name="TABS" handler={this.handleShortcuts} global targetNodeSelector="body">
        <Background id={`section-${anchor}`} style={{ backgroundImage: `url(img/backgrounds/${background})` }}>
          <Wrapper>
            <ScrollableAnchor id={anchor}>
              <span />
            </ScrollableAnchor>
            <Title>
              {titlePrefix} - {stat.title}
            </Title>

            <Content>
              {onMoveUp && (
                <Control
                  className="fa fa-angle-up"
                  onClick={onMoveUp}
                  onKeyUp={onMoveUp}
                  role="button"
                  tabIndex="0"
                  up
                />
              )}

              {ribbonText && (
                <div title="The launch time converted in your time zone">
                  <Ribbon text={ribbonText} />
                </div>
              )}

              <Navbar tabs={this.navbarTabs} onChangeCallback={this.onNavbarChange} selectedTab={stat.tabTitle} />

              <Stat>{statcomponent}</Stat>

              {stat.text && (
                <Text>
                  {stat.text}{' '}
                  {stat.title === 'Starlink' && (
                    <span>
                      More info at{' '}
                      <Link
                        eventLabel="Exit to Starlink website"
                        to="https://www.starlink.com/"
                        title="Starlink website"
                      >
                        www.starlink.com
                      </Link>
                      .
                    </span>
                  )}
                </Text>
              )}

              {onMoveDown && (
                <Control
                  className="fa fa-angle-down"
                  onClick={onMoveDown}
                  onKeyUp={onMoveDown}
                  role="button"
                  tabIndex="0"
                  down
                />
              )}
            </Content>
          </Wrapper>
        </Background>
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
