import React, { ReactNode, useEffect, useRef } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { selectCurrentTab, actions, SectionId } from 'redux/navigation';
import { isInViewport, updateHash } from 'utils/scroll';
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
  const sectionRef = useRef<HTMLDivElement>(null);

  const dispatch = useDispatch();
  const currentTab = useSelector(selectCurrentTab(id)) || tabs[0].id;
  const displayedTab = tabs.find((tab) => tab.id === currentTab)!;

  const changeTab = (tab: string) => {
    dispatch(actions.changeTab({ section: id, tab }));
    updateHash(`${id}-${tab}`);
  };

  useEffect(() => {
    if (typeof window === 'undefined') {
      return;
    }

    window.addEventListener('scroll', () => {
      const currentTabFromRef = sectionRef?.current?.dataset?.tab;
      if (isInViewport(id) && currentTabFromRef) {
        updateHash(`${id}-${currentTabFromRef}`);
      }
    });
  }, [currentTab]);

  return (
    <Background
      tag="section"
      filename={`backgrounds/${displayedTab.background}`}
    >
      <Wrapper id={id} ref={sectionRef} data-tab={currentTab}>
        <Title>
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
          />

          {displayedTab.render}

          {down && (
            <Control
              onClick={() =>
                dispatch(actions.navigateTo({ section: down, down: true }))
              }
              type="button"
              down
            />
          )}
        </Content>
      </Wrapper>
    </Background>
  );
};

export default Section;
