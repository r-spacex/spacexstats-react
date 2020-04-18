import React from 'react';
import { Bar, Doughnut } from 'react-chartjs-2';
import Section, {
  SectionContent,
  SectionDescription,
} from 'components/ui/Section';
import IntegerStat from 'components/ui/IntegerStat';

const Payloads = ({ currentTab, changeTab, data }) => {
  const tabs = [
    {
      label: 'Upmass',
      background: 'payloadfairing.jpg',
      title: 'Upmass',
    },
    {
      label: 'Heaviest',
      background: 'payloadfairing.jpg',
      title: 'Heaviest',
    },
    {
      label: 'Heaviest to GTO',
      background: 'payloadfairing.jpg',
      title: 'Heaviest to GTO',
    },
    {
      label: 'Customers',
      background: 'payloadfairing.jpg',
      title: 'Customers',
    },
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
        <>
          {displayedTab === tabs[0].label && (
            <>
              <SectionContent>
                <Bar
                  data={data.upmassPerYear.data}
                  options={data.upmassPerYear.options}
                />
              </SectionContent>
              <SectionDescription>
                {`SpaceX has launched a total of ${data.totalMass} kilograms worth of payloads into a
                variety of orbits, including interplanetary missions. With Falcon 9 and Falcon Heavy, SpaceX is able to
                cover most orbit and mission types. These payloads can have a variety of masses, from the smallest
                cubesats which can weigh less than 1 kilogram, to huge comsats over 5 tonnes.`}
              </SectionDescription>
            </>
          )}

          {displayedTab === tabs[1].label && (
            <>
              <SectionContent>
                <IntegerStat
                  value={parseInt(data.heaviestPayload.mass, 10)}
                  subtitle="Kilograms"
                />
              </SectionContent>
              <SectionDescription>
                {`${data.heaviestPayload.mission}, launched for ${data.heaviestPayload.customers} represents the heaviest
                payload SpaceX has lofted into orbit.`}
              </SectionDescription>
            </>
          )}

          {displayedTab === tabs[2].label && (
            <>
              <SectionContent>
                <IntegerStat
                  value={parseInt(data.heaviestPayloadGTO.mass, 10)}
                  subtitle="Kilograms"
                />
              </SectionContent>
              <SectionDescription>
                {`Geostationary Orbit serves as the nest for heavy communications satellites, where they can orbit the
                Earth at the same speed as the Earth rotates. ${data.heaviestPayloadGTO.mission}, launched for 
                ${data.heaviestPayloadGTO.customers} represents the heaviest payload SpaceX has lofted into GTO.`}
              </SectionDescription>
            </>
          )}

          {displayedTab === tabs[3].label && (
            <>
              <SectionContent>
                <Doughnut
                  data={data.customersChart.data}
                  options={data.customersChart.options}
                />
              </SectionContent>
              <SectionDescription>
                SpaceX has many commercial customers as well as public agencies
                such as NASA and USAF.
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

export default Payloads;
