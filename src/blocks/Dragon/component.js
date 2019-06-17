import React, { Fragment } from 'react';
import { Bar } from 'react-chartjs-2';
import Section, { SectionContent, SectionDescription } from 'components/Section';
import IntegerStat from 'components/IntegerStat';

const Dragon = ({ currentTab, changeTab, data }) => {
  const tabs = [
    {
      label: 'Missions',
      background: 'dragoncrs5.jpg',
      title: 'Missions'
    },
    {
      label: 'Flight Times',
      background: 'dragoncrs5.jpg',
      title: 'Flight Times'
    },
    {
      label: 'Up',
      background: 'dragoncrs5.jpg',
      title: 'Up'
    },
    {
      label: 'Down',
      background: 'dragoncrs5.jpg',
      title: 'Down'
    }
  ];
  const displayedTab = currentTab || tabs[0].label;

  return (
    <Section
      title="Dragon"
      tabs={tabs}
      currentTab={displayedTab}
      changeTab={changeTab}
      upAnchor="payloads"
      selfAnchor="dragon"
      downAnchor="people"
    >
      {data ? (
        <Fragment>
          {displayedTab === tabs[0].label && (
            <Fragment>
              <SectionContent>
                <IntegerStat value={data.totalFlights} subtitle="Flights" />
              </SectionContent>
              <SectionDescription>
                {`Dragon is SpaceX's orbital spacecraft, and has flown ${data.totalFlights} times atop of a Falcon 9
                rocket. In December 2010, Dragon became the first privately developed spacecraft to be successfully
                recovered from orbit. Dragon 2 extends Dragon's ability to carry not only cargo, but crew too.`}
              </SectionDescription>
            </Fragment>
          )}

          {displayedTab === tabs[1].label && (
            <Fragment>
              <SectionContent>
                <Bar data={data.crsFlightTimesChart.data} options={data.crsFlightTimesChart.options} />
              </SectionContent>
              <SectionDescription>
                {`Shown above is a graph plotting individual mission flight time per each Dragon mission, for a total of 
                ${data.totalFlightTime}. Each vehicle stays berthed to the ISS for approximately 30 days, with crewed
                vehicles staying for up to 6 months.`}
              </SectionDescription>
            </Fragment>
          )}

          {displayedTab === tabs[2].label && (
            <Fragment>
              <SectionContent>
                <IntegerStat value={parseInt(data.totalCargoUp, 10)} subtitle="Kilograms up" />
              </SectionContent>
              <SectionDescription>
                Dragon remains the only spacecraft in service capable of returning significant quantities of cargo from
                the Station to Earth - up to 6 tonnes up and 3 tonnes down.
              </SectionDescription>
            </Fragment>
          )}

          {displayedTab === tabs[3].label && (
            <Fragment>
              <SectionContent>
                <IntegerStat value={parseInt(data.totalCargoDown, 10)} subtitle="Kilograms down" />
              </SectionContent>
              <SectionDescription>
                Dragon remains the only spacecraft in service capable of returning significant quantities of cargo from
                the Station to Earth - up to 6 tonnes up and 3 tonnes down.
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

export default Dragon;
