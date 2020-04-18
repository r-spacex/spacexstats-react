import PropTypes from 'prop-types';
import React, { Component } from 'react';
import ReactGA from 'react-ga';

import { Wrapper, Tab } from './style';

class Navbar extends Component {
  changeTab = (tab) => {
    const { onChange, value } = this.props;

    if (tab === value) {
      return;
    }

    onChange(tab);

    ReactGA.event({
      category: 'Tab',
      action: 'Change',
      label: tab,
    });
  };

  render() {
    const { tabs, value } = this.props;

    return (
      <Wrapper>
        {tabs.map((tab, index) => (
          <Tab
            key={index}
            type="button"
            onClick={() => {
              this.changeTab(tab);
            }}
            active={tab === value}
          >
            {tab}
          </Tab>
        ))}
      </Wrapper>
    );
  }
}

Navbar.propTypes = {
  tabs: PropTypes.arrayOf(PropTypes.string).isRequired,
  value: PropTypes.string.isRequired,
  onChange: PropTypes.func.isRequired,
};

export default Navbar;
