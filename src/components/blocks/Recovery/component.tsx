import React from 'react';
import { Bar } from 'react-chartjs-2';
import Section, {
  SectionContent,
  SectionDescription,
} from 'components/ui/Section';
import IntegerStat from 'components/ui/IntegerStat';
import { modelizer } from './modelizer';
import { BlockProps } from 'types';

const Landing: React.FC<BlockProps> = ({ data, ...rest }) => {
  const {
    landedBoostersCount,
    landingHistory,
    heaviestLanding,
    fairingsRecovery,
  } = modelizer(data);

  const tabs = [
    {
      id: 'landing-history',
      label: 'Landing History',
      background: 'doublelanding.jpg',
      title: 'Landing History',
      render: (
        <>
          <SectionContent>
            <Bar data={landingHistory.data} options={landingHistory.options} />
          </SectionContent>
          <SectionDescription>
            {`SpaceX begun its testing of booster landings in 2013. Now landings
            are almost routine for the public.`}
          </SectionDescription>
        </>
      ),
    },
    {
      id: 'boosters-landed',
      label: 'Boosters Landings',
      background: 'doublelanding.jpg',
      title: 'Boosters Landings',
      render: (
        <>
          <SectionContent>
            <IntegerStat value={landedBoostersCount} subtitle="Landings" />
          </SectionContent>
          <SectionDescription>
            {`For SpaceX to succeed at reducing the cost of getting payload to
            orbit, reusability of launch vehicles is imperative. The first phase
            of this involves returning the first stage of the rocket back safely
            to Earth intact - an incredibly difficult task involving a
            combination of three burns that must be executed perfectly.`}
          </SectionDescription>
        </>
      ),
    },
    {
      id: 'heaviest-landing',
      label: 'Heaviest',
      background: 'doublelanding.jpg',
      title: 'Heaviest Landing',
      render: (
        <>
          <SectionContent>
            <IntegerStat value={heaviestLanding.mass} subtitle="Kilograms" />
          </SectionContent>
          <SectionDescription>
            {`The heaviest mission launched to date that enabled a successful
            landing was the ${heaviestLanding.mission} mission, which performed
            ${heaviestLanding.landingType}.`}
          </SectionDescription>
        </>
      ),
    },
    {
      id: 'fairings-recovery',
      label: 'Fairings Recovery',
      background: 'fairingrecovery.jpg',
      title: 'Fairings Recovery',
      render: (
        <>
          <SectionContent>
            <Bar
              data={fairingsRecovery.data}
              options={fairingsRecovery.options}
            />
          </SectionContent>
          <SectionDescription>
            {`Made of carbon fiber, the industrial process required to make the
            fairings is time and factory space consuming. Reusing them is the
            next step towards reduced launch costs. SpaceX dedicated two ships
            to catch each fairing half.`}
          </SectionDescription>
        </>
      ),
    },
  ];

  return <Section title="Recovery" tabs={tabs} {...rest} />;
};

export default Landing;
