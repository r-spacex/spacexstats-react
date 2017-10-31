import React, { Component } from 'react';
import ReactGA from 'react-ga';
import PropTypes from 'prop-types';

class Navbar extends Component {
  constructor(props) {
    super(props);
    this.state = {
      currentTab: props.tabs[0],
    };
  }

  componentWillReceiveProps(newProps) {
    if (newProps.selectedTab !== null) {
      this.setState({currentTab: newProps.selectedTab});
    }
  }

  changeTab = (tab) => {
    if (tab === this.state.currentTab) {
      return;
    }

    this.setState({currentTab: tab});

    if (this.props.onChangeCallback) {
      this.props.onChangeCallback(tab);
    }

    ReactGA.event({
      category: 'Tab',
      action: 'Change',
      label: tab,
    });
  }

  render() {
    return (
      <nav className="Navbar fx-col-xs fx-row fx-wrap">
        {this.props.tabs.map((tab, index) => (
          <div key={index} className="fx-col-xs">
            <a onClick={() => { this.changeTab(tab); }}
               className={`Navbar__link ${tab === this.state.currentTab ? ' Navbar__link--active' : ''}`}>
              {tab}
            </a>
          </div>
       ))}
      </nav>
    );
  }
}

Navbar.propTypes = {
  tabs: PropTypes.array.isRequired,
  selectedTab: PropTypes.string,
  onChangeCallback: PropTypes.func,
};

export default Navbar;
