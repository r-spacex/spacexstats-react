import React from 'react';
import Section, {
  SectionContent,
  SectionDescription,
} from 'components/ui/Section';
import IntegerStat from 'components/ui/IntegerStat';
import { modelizer } from './modelizer';
import { BlockProps } from 'types';
import { Line, Bar } from 'react-chartjs-2';

const Starlink: React.FC<BlockProps> = ({ data, ...rest }) => {
  const { inSpace, launchRate, deorbited } = modelizer(data);
  const tabs = [
    {
      id: 'in-space',
      label: 'In Space',
      background: 'starlink.jpg',
      title: 'In Space',
      render: (
        <>
          <SectionContent>
            <Line data={inSpace.data} options={inSpace.options} />
          </SectionContent>
          <SectionDescription>
            {`SpaceX is developing a low latency, broadband internet system to
            meet the needs of consumers across the globe. Enabled by a
            constellation of low Earth orbit satellites, Starlink will provide
            fast, reliable internet to populations with little or no
            connectivity, including those in rural communities and places where
            existing services are too expensive or unreliable.`}
          </SectionDescription>
        </>
      ),
    },
    {
      id: 'launch-rate',
      label: 'Launch Rate',
      background: 'starlink.jpg',
      title: 'Launch Rate',
      render: (
        <>
          <SectionContent>
            <Bar data={launchRate.data} options={launchRate.options} />
          </SectionContent>
          <SectionDescription>
            {`To achieve such a feat, SpaceX will have to launch satellites almost
            on a weekly basis. For now the Falcon 9 is used as the main
            workhorse to lift those satellites into orbit, but Starship will be
            able to carry a lot more when it becomes operational.`}
          </SectionDescription>
        </>
      ),
    },
    {
      id: 'deorbited',
      label: 'Deorbited',
      background: 'starlink.jpg',
      title: 'Deorbited',
      render: (
        <>
          <SectionContent>
            <IntegerStat value={deorbited} subtitle="Deorbited" />
          </SectionContent>
          <SectionDescription>
            {`Starlink is on the leading edge of on-orbit debris mitigation,
            meeting or exceeding all regulatory and industry standards. At end
            of life, the satellites will utilize their on-board propulsion
            system to deorbit over the course of a few months. In the unlikely
            event the propulsion system becomes inoperable, the satellites will
            burn up in Earth's atmosphere within 1-5 years, significantly less
            than the hundreds or thousands of years required at higher
            altitudes.`}
          </SectionDescription>
        </>
      ),
    },
  ];

  return <Section title="Starlink" tabs={tabs} {...rest} />;
};

export default Starlink;
