import React from 'react';
import format from 'date-fns/format';
import Section, {
  SectionContent,
  SectionDescription,
} from 'components/ui/Section';
import IntegerStat from 'components/ui/IntegerStat';

const Launchcount = ({ currentTab, changeTab, data }) => {
  const tabs = [
    {
      label: 'Total',
      background: 'seslaunch.jpg',
      title: 'Total',
    },
    {
      label: 'Falcon 9',
      background: 'seslaunch.jpg',
      title: 'Falcon 9',
    },
    {
      label: 'Falcon Heavy',
      background: 'seslaunch.jpg',
      title: 'Falcon Heavy',
    },
    {
      label: 'Super Heavy/Starship',
      background: 'seslaunch.jpg',
      title: 'Super Heavy/Starship',
    },
    {
      label: 'Falcon 1',
      background: 'seslaunch.jpg',
      title: 'Falcon 1',
    },
  ];
  const displayedTab = currentTab || tabs[0].label;

  return (
    <Section
      title="Launch Count"
      tabs={tabs}
      currentTab={displayedTab}
      changeTab={changeTab}
      upAnchor="upcoming"
      selfAnchor="launchcount"
      downAnchor="launchhistory"
    >
      {data ? (
        <>
          {displayedTab === tabs[0].label && (
            <>
              <SectionContent>
                <IntegerStat value={data.totalLaunches} subtitle="Flights" />
              </SectionContent>
              <SectionDescription>
                {`As of ${format(
                  data.lastLaunchDate,
                  'MMMM yyyy',
                )}, SpaceX has launched ${data.totalLaunches} rockets,
                carrying a variety of payloads to multiple destinations;including LEO, GTO, L1, and the ISS. SpaceX
                currently has a manifest of over 60 flights that will fly over the coming years.`}
              </SectionDescription>
            </>
          )}

          {displayedTab === tabs[1].label && (
            <>
              <SectionContent>
                <IntegerStat value={data.totalFalcon9} subtitle="Flights" />
              </SectionContent>
              <SectionDescription>
                {`Nearly 3/4's the height of the Saturn V, yet thinner than a Space Shuttle SRB, Falcon 9 is the workhorse
                of SpaceX's rocket fleet. To date, it has launched ${
                  data.totalFalcon9
                } times and has lifted
                ${Math.floor(
                  data.totalFalcon9Upmass,
                ).toLocaleString()}kg to orbit. It is currently flying in its final
                iteration (Falcon 9 v1.2 Block 5) enabling rapid reusability.`}
              </SectionDescription>
            </>
          )}

          {displayedTab === tabs[2].label && (
            <>
              <SectionContent>
                <IntegerStat value={data.totalFalconHeavy} subtitle="Flights" />
              </SectionContent>
              <SectionDescription>
                {`Falcon Heavy is the world's most powerful rocket, able to carry up to 64 metric tonnes to LEO in full
                expendable mode, rising on its 27 first stage Merlin 1D engines. Only the mighty Saturn V has delivered
                more payload to orbit.`}
              </SectionDescription>
            </>
          )}

          {displayedTab === tabs[3].label && (
            <>
              <SectionContent>
                <IntegerStat value={data.totalBFR} subtitle="Flights" />
              </SectionContent>
              <SectionDescription>
                {`The Super Heavy/Starship rocket stack will stand 106 meters tall, 9 meters wide, and will be able to
                carry up to 150 tonnes (reusable) to Low Earth Orbit. This will be the single largest rocket ever
                designed, developed and then built.`}
              </SectionDescription>
            </>
          )}

          {displayedTab === tabs[4].label && (
            <>
              <SectionContent>
                <IntegerStat value={data.totalFalcon1} subtitle="Flights" />
              </SectionContent>
              <SectionDescription>
                {`Falcon 1 was SpaceX's original two stage rocket - the first stage equipped with a single Merlin 1A
                engine, and later, the venerable Merlin 1C. Launched exclusively from Kwajalein, it was able to lift
                670kg to LEO and became the first privately-developed rocket to reach Earth orbit. It launched 
                ${data.totalFalcon1} times over approximately 2 years, lifting 
                ${Math.floor(
                  data.totalFalcon1Upmass,
                ).toLocaleString()}kg to orbit.`}
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

export default Launchcount;
