import React, { Fragment } from 'react';
import Section, { SectionContent, SectionDescription } from 'components/Section';
import TextStat from 'components/TextStat';

const Starship = ({ currentTab, changeTab, data }) => {
  const tabs = [
    {
      label: 'Hop Tests',
      background: 'bfshop.jpg',
      title: 'Hop Tests'
    },
    {
      label: 'Orbital Tests',
      background: 'bfrorbital.jpg',
      title: 'Orbital Tests'
    },
    {
      label: 'Cargo to Mars',
      background: 'bfrcargo.jpg',
      title: 'Cargo to Mars'
    },
    {
      label: '#dearMoon',
      background: 'bfrdearmoon.jpg',
      title: '#dearMoon'
    },
    {
      label: 'Crew to Mars',
      background: 'mars.jpg',
      title: 'Crew to Mars'
    }
  ];
  const displayedTab = currentTab || tabs[0].label;

  return (
    <Section
      title="Starship"
      tabs={tabs}
      currentTab={displayedTab}
      changeTab={changeTab}
      upAnchor="starlink"
      selfAnchor="starship"
      downAnchor="timelines"
    >
      {data ? (
        <Fragment>
          {displayedTab === tabs[0].label && (
            <Fragment>
              <SectionContent>
                <TextStat value="RIGHT NOW" />
              </SectionContent>
              <SectionDescription>
                SpaceX is conducting an experimental test program of its future launch vehicule, the Super
                Heavy/Starship. A Starship hopper prototype has been built at their Boca Chica, Texas launch site and is
                going through a number of incremental hop tests.
              </SectionDescription>
            </Fragment>
          )}

          {displayedTab === tabs[1].label && (
            <Fragment>
              <SectionContent>
                <TextStat value="2020" />
              </SectionContent>
            </Fragment>
          )}

          {displayedTab === tabs[2].label && (
            <Fragment>
              <SectionContent>
                <TextStat value="2022" />
              </SectionContent>
            </Fragment>
          )}

          {displayedTab === tabs[3].label && (
            <Fragment>
              <SectionContent>
                <TextStat value="2023" />
              </SectionContent>
            </Fragment>
          )}

          {displayedTab === tabs[4].label && (
            <Fragment>
              <SectionContent>
                <TextStat value="2024" />
              </SectionContent>
            </Fragment>
          )}
        </Fragment>
      ) : (
        <SectionContent />
      )}
    </Section>
  );
};

export default Starship;
