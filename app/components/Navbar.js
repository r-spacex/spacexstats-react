import PropTypes from 'prop-types';
import React, { Component } from 'react';
import ReactGA from 'react-ga';

import './Navbar.styl';

class Navbar extends Component {
  constructor(props) {
    super(props);
    this.state = {
      currentTab: props.tabs[0]
    };
  }

  componentWillReceiveProps(newProps) {
    if (newProps.selectedTab !== null) {
      this.setState({ currentTab: newProps.selectedTab });
    }
  }

  changeTab = tab => {
    if (tab === this.state.currentTab) {
      return;
    }

    this.setState({ currentTab: tab });

    if (this.props.onChangeCallback) {
      this.props.onChangeCallback(tab);
    }

    ReactGA.event({
      category: 'Tab',
      action: 'Change',
      label: tab
    });
  };

  render() {
    return (
      <nav className="Navbar fx-col-xs fx-row fx-wrap">
        {this.props.tabs.map((tab, index) => (
          <div key={index} className="fx-col-xs">
            <button
              onClick={() => {
                this.changeTab(tab);
              }}
              className={`Navbar__link ${tab === this.state.currentTab ? ' Navbar__link--active' : ''}`}
            >
              {tab}
            </button>
          </div>
        ))}
      </nav>
    );
  }
}

Navbar.defaultProps = {
  selectedTab: null,
  onChangeCallback: () => {}
};

Navbar.propTypes = {
  tabs: PropTypes.arrayOf(PropTypes.string).isRequired,
  selectedTab: PropTypes.string, // eslint-disable-line react/no-unused-prop-types
  onChangeCallback: PropTypes.func
};

export default Navbar;
