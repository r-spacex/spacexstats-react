import React from 'react';
import { Bar, Pie } from 'react-chartjs-2';
import Section, {
  SectionContent,
  SectionDescription,
} from 'components/ui/Section';
import IntegerStat from 'components/ui/IntegerStat';
import { modelizer } from './modelizer';
import { BlockProps } from 'types';

const Dragon: React.FC<BlockProps> = ({ data, ...rest }) => {
  const { missions, crsFlights, commercialCrewFlights } = modelizer(data);

  const tabs = [
    {
      id: 'missions',
      label: 'Missions',
      background: 'cargodragon.jpg',
      title: 'Missions',
      render: (
        <>
          <SectionContent>
            <Pie data={missions.data} options={missions.options} />
          </SectionContent>
          <SectionDescription>
            {`Dragon is SpaceX's orbital spacecraft, and has flown
            ${missions.totalFlights} times atop of a Falcon 9 rocket. In December
            2010, Dragon became the first privately developed spacecraft to be
            successfully recovered from orbit. Dragon 2 extends Dragon's ability
            to carry not only cargo, but crew too.`}
          </SectionDescription>
        </>
      ),
    },
    {
      id: 'crs',
      label: 'CRS',
      background: 'dragoncrs5.jpg',
      title: 'CRS Flights',
      render: (
        <>
          <SectionContent>
            <Bar data={crsFlights.data} options={crsFlights.options} />
          </SectionContent>
          <SectionDescription>
            {`Shown above is a graph plotting individual mission flight time per
            each Dragon mission, for a total of ${crsFlights.totalFlightTime}.
            Each vehicle stays berthed to the ISS for approximately 30 days,
            with crewed vehicles staying for up to 6 months.`}
          </SectionDescription>
        </>
      ),
    },
    {
      id: 'commercial-crew',
      label: 'Commercial Crew',
      background: 'commercialcrew.jpg',
      title: 'Commercial Crew Flights',
      render: (
        <>
          <SectionContent>
            <Bar
              data={commercialCrewFlights.data}
              options={commercialCrewFlights.options}
            />
          </SectionContent>
          <SectionDescription>
            {`Operational contracts to fly astronauts were awarded in September
            2014 to SpaceX and Boeing. Pending completion of the demonstration
            flights, each company is contracted to supply six flights to ISS.
            Dragon 2 is an evolution of the Dragon 1 capsule that is able to
            transport humans to Low Earth Orbit.`}
          </SectionDescription>
        </>
      ),
    },
    {
      id: 'dragonxl',
      label: 'Dragon XL',
      background: 'dragonxl.jpg',
      title: 'Dragon XL',
      render: (
        <>
          <SectionContent>
            <IntegerStat value={0} subtitle="Flights" />
          </SectionContent>
          <SectionDescription>
            {`In March 2020, NASA has selected SpaceX to deliver supplies to the
            planned Gateway mini-space station in lunar orbit using a new
            version of the Dragon cargo vehicle launched atop Falcon Heavy
            rockets.`}
          </SectionDescription>
        </>
      ),
    },
  ];

  return <Section title="Dragon" tabs={tabs} {...rest} />;
};

export default Dragon;
