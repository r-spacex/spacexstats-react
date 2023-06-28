import React from 'react';
import Section, {
  SectionContent,
  SectionDescription,
} from 'components/ui/Section';
import TextStat from 'components/ui/TextStat';
import { BlockProps } from 'types';

const Starship: React.FC<BlockProps> = ({ ...rest }) => {
  const tabs = [
    {
      id: 'orbital-tests',
      label: 'Orbital Tests',
      background: 'bfrorbital.jpg',
      title: 'Orbital Tests',
      render: (
        <>
          <SectionContent>
            <TextStat>2023</TextStat>
          </SectionContent>
          <SectionDescription>
            {`SpaceX is conducting an experimental test program of its future
            launch vehicle, the Super Heavy/Starship. SpaceX already did an Integrated Flight Test that ended by an explosion 4 minutes into the flight. SpaceX is currently preparing for another test launch with the goal of reaching orbit with the Starship second stage and the Super heavy booster.`}
          </SectionDescription>
        </>
      ),
    },
    {
      id: 'cargo-to-mars',
      label: 'Cargo to Mars',
      background: 'bfrcargo.png',
      title: 'Cargo to Mars',
      render: (
        <>
          <SectionContent>
            <TextStat>2026</TextStat>
          </SectionContent>
          <SectionDescription>
            {`While Starship will be developed to enter mass production and
            execute most SpaceX missions, two cargo Starships will be retired
            and launched towards Mars. The goal will be to prove that Earth
            landing technologies also work on Mars.`}
          </SectionDescription>
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
            <TextStat>2025</TextStat>
          </SectionContent>
          <SectionDescription>
            {`After having a successfuly reusable launch vehicule, the next
            challenge will be to develop the crewed version and send people with
            it. Yasuka Maezawa, a Japanese billionaire, has already bought the
            first Starship crewed flight to go around Moon with artists.`}
          </SectionDescription>
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
            <TextStat>2028</TextStat>
          </SectionContent>
          <SectionDescription>
            {`By 2028, Starship should have dozens of successful flights under its
            belt in the near-Earth space. SpaceX's goal is to land two cargo and
            two crewed Starships on Mars. After that, the rest
            should be history.`}
          </SectionDescription>
        </>
      ),
    },
  ];

  return <Section title="Starship" tabs={tabs} {...rest} />;
};

export default Starship;
