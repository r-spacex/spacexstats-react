import React, { Component } from 'react';
import PropTypes from 'prop-types';

class Navbar extends Component {
  constructor(props) {
    super(props);
    this.state = {
      currentTab: props.tabs[0],
    };
  }

  changeTab = (tab) => {
    if (tab === this.state.currentTab) {
      return;
    }

    this.setState({currentTab: tab});

    if (this.props.onChangeCallback) {
      this.props.onChangeCallback(tab);
    }
  }

  render() {
    return (
      <nav className="Navbar fx-row fx-wrap">
        {this.props.tabs.map((tab, index) => (
          <div key={index} className="Navbar__linkWrapper fx-col-xs-4 fx-col-sm-3 fx-col-md-2">
            <a onClick={() => { this.changeTab(tab); }}
               className={'Navbar__link ' + (tab === this.state.currentTab ? ' Navbar__link--active' : '')}>
              {tab}
            </a>
          </div>
       ))}
      </nav>
    );
  }
}

Navbar.propTypes = {
  onChangeCallback: PropTypes.func,
  tabs: PropTypes.array.isRequired,
};

export default Navbar;
