import React from 'react';
import { Bar, Doughnut } from 'react-chartjs-2';
import Section, {
  SectionContent,
  SectionDescription,
} from 'components/ui/Section';
import IntegerStat from 'components/ui/IntegerStat';
import { modelizer } from './modelizer';
import { BlockProps } from 'types';

const Payloads: React.FC<BlockProps> = ({ data, ...rest }) => {
  const {
    customers,
    upmassPerYear,
    totalMass,
    heaviestPayload,
    heaviestPayloadGTO,
  } = modelizer(data);

  const tabs = [
    {
      id: 'upmass-per-year',
      label: 'Upmass',
      background: 'payloadfairing.jpg',
      title: 'Upmass',
      render: (
        <>
          <SectionContent>
            <Bar data={upmassPerYear.data} options={upmassPerYear.options} />
          </SectionContent>
          <SectionDescription>
            {`SpaceX has launched a total of ${totalMass} metric tons worth of
            payloads into a variety of orbits, including interplanetary
            missions. With Falcon 9 and Falcon Heavy, SpaceX is able to cover
            most orbit and mission types. These payloads can have a variety of
            masses, from the smallest cubesats which can weigh less than 1
            kilogram, to huge comsats over 5 tonnes.`}
          </SectionDescription>
        </>
      ),
    },
    {
      id: 'customers',
      label: 'Customers',
      background: 'payloadfairing.jpg',
      title: 'Customers',
      render: (
        <>
          <SectionContent>
            <Doughnut data={customers.data} options={customers.options} />
          </SectionContent>
          <SectionDescription>
            {`SpaceX has many commercial customers as well as public agencies such
            as NASA and USAF.`}
          </SectionDescription>
        </>
      ),
    },
    {
      id: 'heaviest',
      label: 'Heaviest',
      background: 'payloadfairing.jpg',
      title: 'Heaviest',
      render: (
        <>
          <SectionContent>
            <IntegerStat value={heaviestPayload.mass} subtitle="Kilograms" />
          </SectionContent>
          <SectionDescription>
            {`${heaviestPayload.mission} launched for
            ${heaviestPayload.customers} represents the heaviest payload SpaceX
            has lofted into orbit.`}
          </SectionDescription>
        </>
      ),
    },
    {
      id: 'heaviest-to-gto',
      label: 'Heaviest to GTO',
      background: 'payloadfairing.jpg',
      title: 'Heaviest to GTO',
      render: (
        <>
          <SectionContent>
            <IntegerStat value={heaviestPayloadGTO.mass} subtitle="Kilograms" />
          </SectionContent>
          <SectionDescription>
            {`Geostationary Orbit serves as the nest for heavy communications
            satellites, where they can orbit the Earth at the same speed as the
            Earth rotates. ${heaviestPayloadGTO.mission} launched for
            ${heaviestPayloadGTO.customers} represents the heaviest payload
            SpaceX has lofted into GTO.`}
          </SectionDescription>
        </>
      ),
    },
  ];

  return <Section title="Payloads" tabs={tabs} {...rest} />;
};

export default Payloads;
