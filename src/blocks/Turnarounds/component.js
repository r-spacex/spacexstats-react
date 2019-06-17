import React, { Fragment } from 'react';
import { Bar, Line } from 'react-chartjs-2';
import Section, { SectionContent, SectionDescription } from 'components/Section';
import TableStat from 'components/TableStat';
import TimeStat from 'components/TimeStat';

const Turnarounds = ({ currentTab, changeTab, data }) => {
  const tabs = [
    {
      label: 'Quickest (same pad)',
      background: 'thaicomlaunch.jpg',
      title: 'Quickest (same pad)'
    },
    // {
    //   label: 'Quickest (all)',
    //   background: 'thaicomlaunch.jpg',
    //   title: 'Quickest (all)'
    // },
    {
      label: 'Since Last Launch',
      background: 'thaicomlaunch.jpg',
      title: 'Since Last Launch'
    },
    {
      label: 'Day Intervals',
      background: 'thaicomlaunch.jpg',
      title: 'Day Intervals'
    }
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
        <Fragment>
          {displayedTab === tabs[0].label && (
            <Fragment>
              <SectionContent>
                <TimeStat value={data.quickestTurnaround.turnaround} type="duration" />
              </SectionContent>
              <SectionDescription>
                {`The quickest turnaround ever on the same pad was between the ${data.quickestTurnaround.mission1} and
                ${data.quickestTurnaround.mission2} missions at ${data.quickestTurnaroundPadName}.`}
              </SectionDescription>
            </Fragment>
          )}

          {/* {displayedTab === tabs[1].label && (
            <Fragment>
              <SectionContent>
                <TimeStat value={data.quickestTurnaroundAllPads.turnaround} type="duration" />
              </SectionContent>
              <SectionDescription>
                {`The quickest turnaround (all missions included) was between the ${data.quickestTurnaroundAllPads.mission1} 
                and ${data.quickestTurnaroundAllPads.mission2} missions.`}
              </SectionDescription>
            </Fragment>
          )} */}

          {displayedTab === tabs[1].label && (
            <Fragment>
              <SectionContent>
                <TimeStat value={data.lastLaunchDate} type="timer" />
              </SectionContent>
            </Fragment>
          )}

          {displayedTab === tabs[2].label && (
            <Fragment>
              <SectionContent>
                <Bar data={data.daysBetweenLaunches.data} options={data.daysBetweenLaunches.options} />
              </SectionContent>
              <SectionDescription>
                {`Launch on demand is a key capability. Eventually, SpaceX's goal is to achieve airplane-like levels of
                availability.`}
              </SectionDescription>
            </Fragment>
          )}
        </Fragment>
      ) : (
        <SectionContent />
      )}
    </Section>
  );
};

export default Turnarounds;
