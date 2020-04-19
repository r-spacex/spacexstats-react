import React from 'react';
import Section, {
  SectionContent,
  SectionDescription,
} from 'components/ui/Section';
import TextStat from 'components/ui/TextStat';
import { modelizer } from './modelizer';
import { BlockProps } from 'types';

const Starship: React.FC<BlockProps> = ({ data, ...rest }) => {
  const { starshipHops } = modelizer(data);

  const tabs = [
    {
      id: 'hop-tests',
      label: 'Hop Tests',
      background: 'bfshop.jpg',
      title: 'Hop Tests',
      render: (
        <>
          <SectionContent>
            <TextStat value="RIGHT NOW" />
          </SectionContent>
          <SectionDescription>
            SpaceX is conducting an experimental test program of its future
            launch vehicule, the Super Heavy/Starship. A Starship hopper
            prototype has been built at their Boca Chica, Texas launch site and
            is going through a number of incremental hop tests.
          </SectionDescription>
        </>
      ),
    },
    {
      id: 'orbital-tests',
      label: 'Orbital Tests',
      background: 'bfrorbital.jpg',
      title: 'Orbital Tests',
      render: (
        <>
          <SectionContent>
            <TextStat value="2020" />
          </SectionContent>
        </>
      ),
    },
    {
      id: 'cargo-to-mars',
      label: 'Cargo to Mars',
      background: 'bfrcargo.jpg',
      title: 'Cargo to Mars',
      render: (
        <>
          <SectionContent>
            <TextStat value="2022" />
          </SectionContent>
        </>
      ),
    },
    {
      id: 'dearMoon',
      label: '#dearMoon',
      background: 'bfrdearmoon.jpg',
      title: '#dearMoon',
      render: (
        <>
          <SectionContent>
            <TextStat value="2023" />
          </SectionContent>
        </>
      ),
    },
    {
      id: 'crew-to-mars',
      label: 'Crew to Mars',
      background: 'mars.jpg',
      title: 'Crew to Mars',
      render: (
        <>
          <SectionContent>
            <TextStat value="2024" />
          </SectionContent>
        </>
      ),
    },
  ];

  return <Section title="Starship" tabs={tabs} {...rest} />;
};

export default Starship;
