import React, { ReactNode } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { selectCurrentTab, actions, SectionId } from 'redux/navigation';
import { updateSectionUrl } from 'utils/scroll';
import Navbar from 'components/ui/Navbar';
import { Background, Wrapper, Title, Content, Control } from './style';

interface SectionTab {
  id: string;
  label: string;
  title: string;
  background: string;
  render: ReactNode;
}

interface Props {
  id: SectionId;
  title: string;
  tabs: SectionTab[];
  up?: SectionId;
  down?: SectionId;
}

const Section: React.FC<Props> = ({ id, title, tabs, up, down }) => {
  const dispatch = useDispatch();
  const currentTab = useSelector(selectCurrentTab(id)) || tabs[0].id;
  const displayedTab = tabs.find((tab) => tab.id === currentTab)!;

  const changeTab = async (tab: string) => {
    await dispatch(actions.changeTab({ section: id, tab }));
    updateSectionUrl();
  };

  return (
    <Background
      tag="section"
      filename={`backgrounds/${displayedTab.background}`}
    >
      <Wrapper id={id} data-tab={currentTab}>
        <Title tabIndex={-1}>
          {title}
          {displayedTab.title && ` - ${displayedTab.title}`}
        </Title>

        <Content>
          {up && (
            <Control
              onClick={() =>
                dispatch(actions.navigateTo({ section: up, down: false }))
              }
              role="button"
              up
            />
          )}

          <Navbar
            tabs={tabs.map((tab) => tab.label)}
            value={displayedTab.label}
            onChange={(tabLabel) => {
              const targetTab = tabs.find((tab) => tab.label === tabLabel)!;
              changeTab(targetTab.id);
            }}
            aria-label="Navigate to previous section"
          />

          {displayedTab.render}

          {down && (
            <Control
              onClick={() =>
                dispatch(actions.navigateTo({ section: down, down: true }))
              }
              type="button"
              down
              aria-label="Navigate to next section"
            />
          )}
        </Content>
      </Wrapper>
    </Background>
  );
};

export default Section;
