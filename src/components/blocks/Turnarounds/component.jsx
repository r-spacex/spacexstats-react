import React from 'react';
import { Bar } from 'react-chartjs-2';
import Section, {
  SectionContent,
  SectionDescription,
} from 'components/ui/Section';
import TimeStat from 'components/ui/TimeStat';

const Turnarounds = ({ currentTab, changeTab, data }) => {
  const tabs = [
    {
      label: 'Quickest (same pad)',
      background: 'thaicomlaunch.jpg',
      title: 'Quickest (same pad)',
    },
    {
      label: 'Since Last Launch',
      background: 'thaicomlaunch.jpg',
      title: 'Since Last Launch',
    },
    {
      label: 'Day Intervals',
      background: 'thaicomlaunch.jpg',
      title: 'Day Intervals',
    },
  ];
  const displayedTab = currentTab || tabs[0].label;

  return (
    <Section
      title="Turnarounds"
      tabs={tabs}
      currentTab={displayedTab}
      changeTab={changeTab}
      upAnchor="reuse"
      selfAnchor="turnarounds"
      downAnchor="payloads"
    >
      {data ? (
        <>
          {displayedTab === tabs[0].label && (
            <>
              <SectionContent>
                <TimeStat
                  value={data.quickestTurnaround.turnaround}
                  type="duration"
                />
              </SectionContent>
              <SectionDescription>
                {`The quickest turnaround ever on the same pad was between the ${data.quickestTurnaround.mission1} and
                ${data.quickestTurnaround.mission2} missions at ${data.quickestTurnaroundPadName}.`}
              </SectionDescription>
            </>
          )}

          {displayedTab === tabs[1].label && (
            <>
              <SectionContent>
                <TimeStat value={data.lastLaunchDate} type="timer" />
              </SectionContent>
            </>
          )}

          {displayedTab === tabs[2].label && (
            <>
              <SectionContent>
                <Bar
                  data={data.daysBetweenLaunches.data}
                  options={data.daysBetweenLaunches.options}
                />
              </SectionContent>
              <SectionDescription>
                {`Launch on demand is a key capability. Eventually, SpaceX's goal is to achieve airplane-like levels of
                availability.`}
              </SectionDescription>
            </>
          )}
        </>
      ) : (
        <SectionContent />
      )}
    </Section>
  );
};

export default Turnarounds;
