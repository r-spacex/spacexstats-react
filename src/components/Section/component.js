import React from 'react';
import Navbar from 'components/Navbar';
import { Background, Wrapper, Title, Content, Control } from './style';

const Section = ({ children, title, tabs, currentTab, changeTab, navigateTo, upAnchor, selfAnchor, downAnchor }) => {
  const displayedTab = tabs.find(tab => tab.label === currentTab);
  const navigateUp = () => navigateTo(upAnchor, false);
  const navigateDown = () => navigateTo(downAnchor, true);

  return (
    <Background tag="section" filename={`backgrounds/${displayedTab.background}`}>
      <Wrapper id={selfAnchor}>
        <Title>
          {title}
          {displayedTab.title && ` - ${displayedTab.title}`}
        </Title>

        <Content>
          {upAnchor && (
            <Control onClick={navigateUp} role="button" tabIndex="0" up>
              <i className="fa fa-angle-up" />
            </Control>
          )}

          <Navbar tabs={tabs.map(tab => tab.label)} value={currentTab} onChange={changeTab} />

          {children}

          {downAnchor && (
            <Control onClick={navigateDown} type="button" down>
              <i className="fa fa-angle-down" />
            </Control>
          )}
        </Content>
      </Wrapper>
    </Background>
  );
};

export default Section;
