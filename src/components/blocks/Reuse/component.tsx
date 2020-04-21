import React from 'react';
import Section, {
  SectionContent,
  SectionDescription,
} from 'components/ui/Section';
import IntegerStat from 'components/ui/IntegerStat';
import { modelizer } from './modelizer';
import { BlockProps } from 'types';
import TimeStat from 'components/ui/TimeStat';
import { Bar } from 'react-chartjs-2';

const Reuse: React.FC<BlockProps> = ({ data, ...rest }) => {
  const {
    reflownLaunchesCount,
    mostLaunches,
    mostReflownCore,
    quickestReuseTurnaround,
    reflownFairingsCount,
  } = modelizer(data);

  const tabs = [
    {
      id: 'reused-flights',
      label: 'Reused flights',
      background: 'reuse.jpg',
      title: 'Reused flights',
      render: (
        <>
          <SectionContent>
            <IntegerStat
              value={reflownLaunchesCount}
              subtitle="Reused flights"
            />
          </SectionContent>
          <SectionDescription>
            {`Once on the ground, the booster must be able to be refurbished and
            reflown in minimal time and with minimal cost. Only then can they be
            reflown, reducing launch costs significantly.`}
          </SectionDescription>
        </>
      ),
    },
    {
      id: 'most-launches',
      label: 'Most launches',
      background: 'reuse.jpg',
      title: 'Most launches',
      render: (
        <>
          <SectionContent>
            <Bar data={mostLaunches.data} options={mostLaunches.options} />
          </SectionContent>
          <SectionDescription>
            {`The ${mostReflownCore.serial} booster is the one who flew the most,
            it was used for these missions: ${mostReflownCore.missions}.`}
          </SectionDescription>
        </>
      ),
    },
    {
      id: 'quickest-turnaround',
      label: 'Quickest turnaround',
      background: 'reuse.jpg',
      title: 'Quickest turnaround',
      render: (
        <>
          <SectionContent>
            <TimeStat
              value={quickestReuseTurnaround.turnaroundTime}
              type="duration"
            />
          </SectionContent>
          <SectionDescription>
            {`The turnaround for a reflown booster includes the refurbishment time
            but also the time to find a customer willing to use it. SpaceX's
            ultimate goal is to achieve a 24h turnaround. The quickest
            turnaround for the same booster was set at
            ${quickestReuseTurnaround.turnaround} by the
            ${quickestReuseTurnaround.core} booster, between the 
            ${quickestReuseTurnaround.launch1}
            and ${quickestReuseTurnaround.launch2} missions.`}
          </SectionDescription>
        </>
      ),
    },
    {
      id: 'fairings',
      label: 'Fairings',
      background: 'reuse.jpg',
      title: 'Fairings',
      render: (
        <>
          <SectionContent>
            <IntegerStat value={reflownFairingsCount} subtitle="Reflown" />
          </SectionContent>
          <SectionDescription>
            {`Made of carbon fiber, the industrial process required to make the fairings is time and factory space
                consuming. Reusing them is the next step towards reduced launch costs. Although SpaceX already fished
                out fairings, it has yet to retrieve them intact from the corrosion of salt water.`}
          </SectionDescription>
        </>
      ),
    },
  ];

  return <Section title="Reuse" tabs={tabs} {...rest} />;
};

export default Reuse;
