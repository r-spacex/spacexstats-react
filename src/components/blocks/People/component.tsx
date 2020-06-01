import React from 'react';
import Section, {
  SectionContent,
  SectionDescription,
} from 'components/ui/Section';
import IntegerStat from 'components/ui/IntegerStat';
import { modelizer } from './modelizer';
import { BlockProps } from 'types';

const People: React.FC<BlockProps> = ({ data, ...rest }) => {
  const { dragonriders, moonPopulation, marsPopulation, employees } = modelizer(
    data,
  );

  const tabs = [
    {
      id: 'dragonriders',
      label: 'Dragonriders',
      background: 'dragonriders.jpg',
      title: 'Dragonriders',
      render: (
        <>
          <SectionContent>
            <IntegerStat value={dragonriders} subtitle="People" />
          </SectionContent>
          <SectionDescription>
            {`Dragon 2, developed as part of NASA's Commercial Crew Transportation
            Capability (CCtCap) program, will be used by NASA astronauts and
            space tourists alike. The first crewed mission flew in May 2020.`}
          </SectionDescription>
        </>
      ),
    },
    {
      id: 'moon-population',
      label: 'Moon Population',
      background: 'moon.jpg',
      title: 'Moon Population',
      render: (
        <>
          <SectionContent>
            <IntegerStat value={moonPopulation} subtitle="People" />
          </SectionContent>
          <SectionDescription>
            {`While the Moon has never been SpaceX's main focus, Starship will
            enable the construction of a Moon Base Alpha if customers want to
            build it.`}
          </SectionDescription>
        </>
      ),
    },
    {
      id: 'mars-population',
      label: 'Mars Population',
      background: 'mars.jpg',
      title: 'Mars Population',
      render: (
        <>
          <SectionContent>
            <IntegerStat value={marsPopulation} subtitle="People" />
          </SectionContent>
          <SectionDescription>
            {`No one's there yet, but SpaceX's goal is to allow for the building
            of an autonomous colony on Mars, which will eventually gather
            thousands of people.`}
          </SectionDescription>
        </>
      ),
    },
    {
      id: 'employees',
      label: 'Employees',
      background: 'tankland.jpg',
      title: 'Employees',
      render: (
        <>
          <SectionContent>
            <IntegerStat value={employees} subtitle="People" />
          </SectionContent>
        </>
      ),
    },
  ];

  return <Section title="People" tabs={tabs} {...rest} />;
};

export default People;
