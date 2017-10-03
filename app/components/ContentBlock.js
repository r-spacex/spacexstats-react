import React, { Component } from 'react';
import PropTypes from 'prop-types';
import IntegerStat from 'components/stats/IntegerStat';
import { Bar } from 'react-chartjs-2';
import Navbar from 'components/Navbar';

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

  onNavbarChange = (tab) => {
    for (const stat of this.props.stats) {
      if (tab === stat.tabTitle) {
        this.setState({currentStat: stat});
      }
    }
  }

  render() {
    let statcomponent;
    switch (this.state.currentStat.type) {
      case 'integer':
        statcomponent = <IntegerStat data={this.state.currentStat.data} />;
        break;

      case 'barchart':
        statcomponent = <Bar data={this.state.currentStat.data} options={this.state.currentStat.options} />;
        break;

      default:
        statcomponent = 'Nothing to display';
    }

    return (
      <article className="ContentBlock" style={{backgroundImage: 'url(img/backgrounds/' + this.props.backgroundImage + ')'}}>
        <div className="fx-container">
          <div className="fx-col full-height">
            <header className="ContentBlock__titleWrapper fx-col fx-center-xs padded">
              <h2 className="ContentBlock__title">
                {this.props.titlePrefix} - {this.state.currentStat.title}
              </h2>
            </header>

            <section className="ContentBlock__stat fx-grow fx-col">
              <Navbar tabs={this.navbarTabs} onChangeCallback={this.onNavbarChange} />
              <div className="fx-grow fx-row fx-center-xs fx-middle-xs mtop-big">
                {statcomponent}
              </div>
              <div className="ContentBlock__text padded mtop-big">
                {this.state.currentStat.text}
              </div>
            </section>
          </div>
        </div>
      </article>
    );
  }
}

ContentBlock.propTypes = {
  titlePrefix: PropTypes.string.isRequired,
  backgroundImage: PropTypes.string.isRequired,
  stats: PropTypes.array.isRequired,
};

export default ContentBlock;
