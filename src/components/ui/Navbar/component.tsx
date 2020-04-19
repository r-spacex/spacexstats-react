import React from 'react';
import ReactGA from 'react-ga';

import { Wrapper, Tab } from './style';

interface Props {
  tabs: string[];
  value: string;
  onChange: (value: string) => void;
}

const Navbar: React.FC<Props> = ({ tabs, value, onChange }) => {
  const changeTab = (tab: string) => {
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

  return (
    <Wrapper>
      {tabs.map((tab) => (
        <Tab
          key={tab}
          type="button"
          onClick={() => changeTab(tab)}
          active={tab === value}
        >
          {tab}
        </Tab>
      ))}
    </Wrapper>
  );
};

export default Navbar;
