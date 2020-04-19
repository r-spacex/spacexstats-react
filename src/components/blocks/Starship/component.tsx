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
            <TextStat>RIGHT NOW</TextStat>
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
            <TextStat>2020</TextStat>
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
            <TextStat>2022</TextStat>
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
            <TextStat>2023</TextStat>
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
            <TextStat>2024</TextStat>
          </SectionContent>
        </>
      ),
    },
  ];

  return <Section title="Starship" tabs={tabs} {...rest} />;
};

export default Starship;
