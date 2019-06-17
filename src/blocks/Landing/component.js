import React, { Fragment } from 'react';
import { Bar } from 'react-chartjs-2';
import Section, { SectionContent, SectionDescription } from 'components/Section';
import IntegerStat from 'components/IntegerStat';

const Landing = ({ currentTab, changeTab, data }) => {
  const tabs = [
    {
      label: 'Cores Landed',
      background: 'doublelanding.jpg',
      title: 'Cores Landed'
    },
    {
      label: 'Landing History',
      background: 'doublelanding.jpg',
      title: 'Landing History'
    },
    {
      label: 'Heaviest',
      background: 'doublelanding.jpg',
      title: 'Heaviest Landing'
    }
  ];
  const displayedTab = currentTab || tabs[0].label;

  return (
    <Section
      title="Landing"
      tabs={tabs}
      currentTab={displayedTab}
      changeTab={changeTab}
      upAnchor="launchpads"
      selfAnchor="landing"
      downAnchor="reuse"
    >
      {data ? (
        <Fragment>
          {displayedTab === tabs[0].label && (
            <Fragment>
              <SectionContent>
                <IntegerStat value={data.totalLanded} subtitle="Landed" />
              </SectionContent>
              <SectionDescription>
                {`For SpaceX to succeed at reducing the cost of getting payload to orbit, reusability of launch vehicles
                is imperative. The first phase of this involves returning the first stage of the rocket back safely to
                Earth intact - an incredibly difficult task involving a combination of three burns that must be executed
                perfectly.`}
              </SectionDescription>
            </Fragment>
          )}

          {displayedTab === tabs[1].label && (
            <Fragment>
              <SectionContent>
                <Bar data={data.landingHistoryChart.data} options={data.landingHistoryChart.options} />
              </SectionContent>
              <SectionDescription>
                {`SpaceX begun its testing of booster landings in 2013. Now landings are almost routine for the public.`}
              </SectionDescription>
            </Fragment>
          )}

          {displayedTab === tabs[2].label && (
            <Fragment>
              <SectionContent>
                <IntegerStat value={data.heaviestLanding.mass} subtitle="Kilograms" />
              </SectionContent>
              <SectionDescription>
                {`The heaviest mission launched to date that enabled a successful landing was the 
                ${data.heaviestLanding.mission} mission, which performed ${data.heaviestLanding.landingType}.`}
              </SectionDescription>
            </Fragment>
          )}
        </Fragment>
      ) : (
        <SectionContent />
      )}
    </Section>
  );
};

export default Landing;
