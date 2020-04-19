import React from 'react';
import { Bar, Line } from 'react-chartjs-2';
import Section, {
  SectionContent,
  SectionDescription,
} from 'components/ui/Section';
import { modelizer } from './modelizer';
import { BlockProps } from 'types';

const LauncHistory: React.FC<BlockProps> = ({ data, ...rest }) => {
  const { flightsPerYear, successRates } = modelizer(data);

  const tabs = [
    {
      id: 'per-year',
      label: 'Launches Per Year',
      background: 'falconheavy.jpg',
      title: 'Launches Per Year',
      render: (
        <>
          <SectionContent>
            <Bar data={flightsPerYear.data} options={flightsPerYear.options} />
          </SectionContent>
          <SectionDescription>
            {`With an ever-increasing launch cadence, SpaceX has surpassed other
            launch providers by annual vehicles launched and continues, nearly year-on-year,
            to set vehicle flight records.`}
          </SectionDescription>
        </>
      ),
    },
    {
      id: 'success-rate',
      label: 'Success Rate',
      background: 'falconheavy.jpg',
      title: 'Success Rate',
      render: (
        <>
          <SectionContent>
            <Line data={successRates.data} options={successRates.options} />
          </SectionContent>
          <SectionDescription>
            {`In order to provide a reliable access to space, SpaceX will have to beat
            every other provider with its success rate.`}
          </SectionDescription>
        </>
      ),
    },
  ];

  return <Section title="Launch History" tabs={tabs} {...rest} />;
};

export default LauncHistory;
