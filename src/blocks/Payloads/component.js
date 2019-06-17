import React, { Fragment } from 'react';
import { Doughnut } from 'react-chartjs-2';
import Section, { SectionContent, SectionDescription } from 'components/Section';
import IntegerStat from 'components/IntegerStat';

const Payloads = ({ currentTab, changeTab, data }) => {
  const tabs = [
    {
      label: 'Total Mass',
      background: 'payloadfairing.jpg',
      title: 'Total Mass'
    },
    {
      label: 'Heaviest',
      background: 'payloadfairing.jpg',
      title: 'Heaviest'
    },
    {
      label: 'Heaviest to GTO',
      background: 'payloadfairing.jpg',
      title: 'Heaviest to GTO'
    },
    {
      label: 'Customers',
      background: 'payloadfairing.jpg',
      title: 'Customers'
    }
  ];
  const displayedTab = currentTab || tabs[0].label;

  return (
    <Section
      title="Payloads"
      tabs={tabs}
      currentTab={displayedTab}
      changeTab={changeTab}
      upAnchor="turnarounds"
      selfAnchor="payloads"
      downAnchor="dragon"
    >
      {data ? (
        <Fragment>
          {displayedTab === tabs[0].label && (
            <Fragment>
              <SectionContent>
                <IntegerStat value={parseInt(data.totalMass, 10)} subtitle="Kilograms" />
              </SectionContent>
              <SectionDescription>
                {`These satellites can have a variety of masses, from the smallest cubesats which can weigh less than 1
                kilogram, to huge comsats over 5 tonnes.`}
              </SectionDescription>
            </Fragment>
          )}

          {displayedTab === tabs[1].label && (
            <Fragment>
              <SectionContent>
                <IntegerStat value={parseInt(data.heaviestPayload.mass, 10)} subtitle="Kilograms" />
              </SectionContent>
              <SectionDescription>
                {`${data.heaviestPayload.mission}, launched for ${data.heaviestPayload.customers} represents the heaviest
                payload SpaceX has lofted into orbit.`}
              </SectionDescription>
            </Fragment>
          )}

          {displayedTab === tabs[2].label && (
            <Fragment>
              <SectionContent>
                <IntegerStat value={parseInt(data.heaviestPayloadGTO.mass, 10)} subtitle="Kilograms" />
              </SectionContent>
              <SectionDescription>
                {`Geostationary Orbit serves as the nest for heavy communications satellites, where they can orbit the
                Earth at the same speed as the Earth rotates. ${data.heaviestPayloadGTO.mission}, launched for 
                ${data.heaviestPayloadGTO.customers} represents the heaviest payload SpaceX has lofted into GTO.`}
              </SectionDescription>
            </Fragment>
          )}

          {displayedTab === tabs[3].label && (
            <Fragment>
              <SectionContent>
                <Doughnut data={data.customersChart.data} options={data.customersChart.options} />
              </SectionContent>
              <SectionDescription>
                {`SpaceX has many commercial customers as well as public agencies such as NASA and USAF.`}
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

export default Payloads;
