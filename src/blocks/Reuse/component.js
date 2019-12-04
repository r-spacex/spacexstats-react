import React from 'react';
import { Bar } from 'react-chartjs-2';
import Section, { SectionContent, SectionDescription } from 'components/Section';
import IntegerStat from 'components/IntegerStat';

const Reuse = ({ currentTab, changeTab, data }) => {
  const tabs = [
    {
      label: 'Reflown',
      background: 'reuse.jpg',
      title: 'Reflown'
    },
    {
      label: 'Most launches',
      background: 'reuse.jpg',
      title: 'Most launches'
    },
    {
      label: 'Day intervals',
      background: 'reuse.jpg',
      title: 'Day intervals'
    },
    {
      label: 'Fairings',
      background: 'reuse.jpg',
      title: 'Fairings'
    }
  ];
  const displayedTab = currentTab || tabs[0].label;

  return (
    <Section
      title="Reuse"
      tabs={tabs}
      currentTab={displayedTab}
      changeTab={changeTab}
      upAnchor="landing"
      selfAnchor="reuse"
      downAnchor="turnarounds"
    >
      {data ? (
        <>
          {displayedTab === tabs[0].label && (
            <>
              <SectionContent>
                <IntegerStat value={data.totalReflown} subtitle="Reflown flights" />
              </SectionContent>
              <SectionDescription>
                {`Once on the ground, the booster must be able to be refurbished and reflown in minimal time and with
                minimal cost. Only then can they be reflown, reducing launch costs significantly.`}
              </SectionDescription>
            </>
          )}

          {displayedTab === tabs[1].label && (
            <>
              <SectionContent>
                <IntegerStat value={data.mostReflownCore.launches} subtitle="Launches" />
              </SectionContent>
              <SectionDescription>
                {`The ${data.mostReflownCore.core} booster is the one who flew the most, it was used for these missions:
                ${data.mostReflownCore.missions}.`}
              </SectionDescription>
            </>
          )}

          {displayedTab === tabs[2].label && (
            <>
              <SectionContent>
                <Bar data={data.daysBetweenReuses.data} options={data.daysBetweenReuses.options} />
              </SectionContent>
              <SectionDescription>
                {`The turnaround for a reflown booster includes the refurbishment time but also the time to find a
                customer willing to use it. SpaceX's ultimate goal is to achieve a 24h turnaround. The quickest
                turnaround for the same booster was set at ${data.quickestReuseTurnaround.turnaround} by the
                ${data.quickestReuseTurnaround.core} booster, between the ${data.quickestReuseTurnaround.mission1}
                and ${data.quickestReuseTurnaround.mission2} missions.`}
              </SectionDescription>
            </>
          )}

          {displayedTab === tabs[3].label && (
            <>
              <SectionContent>
                <IntegerStat value={data.totalFairingsReflown} subtitle="Reflown" />
              </SectionContent>
              <SectionDescription>
                {`Made of carbon fiber, the industrial process required to make the fairings is time and factory space
                consuming. Reusing them is the next step towards reduced launch costs. Although SpaceX already fished
                out fairings, it has yet to retrieve them intact from the corrosion of salt water.`}
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

export default Reuse;
