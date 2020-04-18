import React from 'react';
import Section, {
  SectionContent,
  SectionDescription,
} from 'components/Section';
import TextStat from 'components/TextStat';
import TimeStat from 'components/TimeStat';

const Timelines = ({ currentTab, changeTab, data }) => {
  const tabs = [
    {
      label: "Elon Musk's Bet",
      background: 'elonmusk.jpg',
      title: "Elon Musk's Bet",
    },
    {
      label: "Gwynne Shotwell's Bet",
      background: 'gwynneshotwell.jpg',
      title: "Gwynne Shotwell's Bet",
    },
    {
      label: 'Time Since Founding',
      background: 'spacexhq.jpg',
      title: 'Time Since Founding',
    },
    {
      label: 'Hours Worked',
      background: 'rollout.jpg',
      title: 'Hours Worked',
    },
  ];
  const displayedTab = currentTab || tabs[0].label;

  return (
    <Section
      title="Timelines"
      tabs={tabs}
      currentTab={displayedTab}
      changeTab={changeTab}
      upAnchor="starship"
      selfAnchor="timelines"
      downAnchor="infos"
    >
      {data ? (
        <>
          {displayedTab === tabs[0].label && (
            <>
              <SectionContent>
                <TimeStat value={data.elonMuskBet} type="countdown" />
              </SectionContent>
              <SectionDescription>
                {`In April 2009, Michael S. Malone revealed, while interviewing Elon Musk, that the two had a bet that
                SpaceX would put a man on Mars by "2020 or 2025". Musk has continued to reiterate this rough timeframe
                since. This countdown clock expires on 1 January 2026, at 00:00 UTC. No pressure, Elon.`}
              </SectionDescription>
            </>
          )}

          {displayedTab === tabs[1].label && (
            <>
              <SectionContent>
                <TimeStat value={data.gwynneShotwellBet} type="countdown" />
              </SectionContent>
              <SectionDescription>
                {`In April 2018, SpaceX's COO Gwynne Shotwell declared during a TED interview that SpaceX would provide an
                Earth-to-Earth transportation system within ten years. The price would be a couple thousand dollars per
                person to fly New York to Shanghai. This countdown clock expires on 1 January 2029, at 00:00 UTC. No
                pressure, Gwynne.`}
              </SectionDescription>
            </>
          )}

          {displayedTab === tabs[2].label && (
            <>
              <SectionContent>
                <TimeStat value={data.foundingDate} type="timer" />
              </SectionContent>
              <SectionDescription>
                {`SpaceX was incorporated on March 14, 2002, with their headquarters at a hotel, in downtown Los Angeles.
                By the end of the year, they were 14 employees strong. Their second facility was an enormous warehouse
                in El Segundo, where they built the Falcon 1. When they outgrew that, they moved to their current
                facility in Hawthorne.`}
              </SectionDescription>
            </>
          )}

          {displayedTab === tabs[3].label && (
            <>
              <SectionContent>
                <TextStat value="Countless" />
              </SectionContent>
              <SectionDescription>
                {`Since 14 March 2002, thousands of SpaceX employees and Elon Musk have worked tirelessly to push the
                boundaries of engineering and technology, ultimately providing humanity with cheaper, faster, more
                reliable access to space. Thank you.`}
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

export default Timelines;
