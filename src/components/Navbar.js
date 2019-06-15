import PropTypes from 'prop-types';
import React, { Component } from 'react';
import ReactGA from 'react-ga';
import styled from 'styled-components';

import { colorUsages, thresholds } from 'stylesheet';

const Tab = styled.button`
  display: flex;
  flex-wrap: wrap;

  position: relative;
  z-index: 1;
  display: block;
  padding-left: 0.5rem;
  padding-right: 0.5rem;
  height: 2.5rem;
  line-height: 2.5rem;

  @media (min-width: ${thresholds.sm}) {
    padding-left: 1rem;
    padding-right: 1rem;
    height: 3rem;
    line-height: 3rem;
  }

  text-align: center;
  cursor: pointer;
  border-bottom: 3px solid transparent;
  transition: border-color 0.3s ease-in-out;

  border-color: ${({ active }) => (active ? colorUsages.navbarActiveTab : 'transparent')};
`;

const Wrapper = styled.nav`
  display: flex;
  flex-wrap: wrap;

  @media (min-width: ${thresholds.sm}) {
    ${Tab} {
      margin-left: 1rem;
    }
  }
`;

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
    const { onChangeCallback } = this.props;
    const { currentTab } = this.state;

    if (tab === currentTab) {
      return;
    }

    this.setState({ currentTab: tab });

    if (onChangeCallback) {
      onChangeCallback(tab);
    }

    ReactGA.event({
      category: 'Tab',
      action: 'Change',
      label: tab
    });
  };

  render() {
    const { tabs } = this.props;
    const { currentTab } = this.state;

    return (
      <Wrapper>
        {tabs.map((tab, index) => (
          <Tab
            key={index}
            type="button"
            onClick={() => {
              this.changeTab(tab);
            }}
            active={tab === currentTab}
          >
            {tab}
          </Tab>
        ))}
      </Wrapper>
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
