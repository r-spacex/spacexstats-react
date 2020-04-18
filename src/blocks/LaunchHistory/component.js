import React from 'react';
import { Bar, Line } from 'react-chartjs-2';
import Section, {
  SectionContent,
  SectionDescription,
} from 'components/Section';

const LauncHistory = ({ currentTab, changeTab, data }) => {
  const tabs = [
    {
      label: 'Launches Per Year',
      background: 'falconheavy.jpg',
      title: 'Launches Per Year',
    },
    {
      label: 'Success Rate',
      background: 'falconheavy.jpg',
      title: 'Success Rate',
    },
  ];
  const displayedTab = currentTab || tabs[0].label;

  return (
    <Section
      title="Launch History"
      tabs={tabs}
      currentTab={displayedTab}
      changeTab={changeTab}
      upAnchor="launchcount"
      selfAnchor="launchhistory"
      downAnchor="launchpads"
    >
      {data ? (
        <>
          {displayedTab === tabs[0].label && (
            <>
              <SectionContent>
                <Bar
                  data={data.flightsPerYear.data}
                  options={data.flightsPerYear.options}
                />
              </SectionContent>
              <SectionDescription>
                {`With an ever-increasing launch cadence, SpaceX has surpassed other launch providers by annual vehicles
                launched and continues, nearly year-on-year, to set vehicle flight records.`}
              </SectionDescription>
            </>
          )}

          {displayedTab === tabs[1].label && (
            <>
              <SectionContent>
                <Line
                  data={data.successRates.data}
                  options={data.successRates.options}
                />
              </SectionContent>
              <SectionDescription>
                {`In order to provide a reliable access to space, SpaceX will have to beat every other provider with its
                success rate.`}
              </SectionDescription>
            </>
          )}
        </>
      ) : (
        <SectionContent />
      )}
    </Section>
  );
};

export default LauncHistory;
