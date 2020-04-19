import React from 'react';
import { Bar } from 'react-chartjs-2';
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
      background: 'bfshop.png',
      title: 'Hop Tests',
      render: (
        <>
          <SectionContent>
            <Bar data={starshipHops.data} options={starshipHops.options} />
          </SectionContent>
          <SectionDescription>
            {`SpaceX is conducting an experimental test program of its future
            launch vehicule, the Super Heavy/Starship. Incremental hop tests
            will serve to validate landing procedures for a reusabe second stage
            and a heat shielding technology.`}
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
            <TextStat>2021</TextStat>
          </SectionContent>
          <SectionDescription>
            {`SpaceX is already in talks with three potential customers for a
            commercial satellite launch in 2021. Before that, SpaceX will have
            to reach orbit with the Starship second stage and the Super heavy
            booster. They will also test orbital refueling, a technology
            necessary to go to other distant bodies such as the Moon or Mars.`}
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
            <TextStat>2022</TextStat>
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
            <TextStat>2023</TextStat>
          </SectionContent>
          <SectionDescription>
            {`After having a successfuly reusable launch vehicule, the next
            challenge will be to develop the crewed version and send people with
            it. Yasuka Maezawa, a Japanese billionaire, has already bought the
            first Starship crewed flight to go around Moon with artists in 2023.`}
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
            <TextStat>2024</TextStat>
          </SectionContent>
          <SectionDescription>
            {`By 2024, Starship should have dozens of successful flights under its
            belt in the near-Earth space. SpaceX's goal is to land two cargo and
            two crewed Starships on Mars in five years. After that, the rest
            should be history.`}
          </SectionDescription>
        </>
      ),
    },
  ];

  return <Section title="Starship" tabs={tabs} {...rest} />;
};

export default Starship;
