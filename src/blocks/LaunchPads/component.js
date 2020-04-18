import React from 'react';
import Section, {
  SectionContent,
  SectionDescription,
} from 'components/Section';
import IntegerStat from 'components/IntegerStat';

const LaunchPads = ({ currentTab, changeTab, data }) => {
  const tabs = [
    {
      label: 'KSC',
      background: 'ses10.jpg',
      title: 'KSC',
    },
    {
      label: 'Cape Canaveral',
      background: 'capeflorida.jpg',
      title: 'Cape Canaveral',
    },
    {
      label: 'Vandenberg',
      background: 'iridium1.jpg',
      title: 'Vandenberg',
    },
    {
      label: 'Boca Chica',
      background: 'bocachica.jpg',
      title: 'Boca Chica',
    },
    {
      label: 'Kwajalein',
      background: 'kwaj.jpg',
      title: 'Kwajalein',
    },
  ];
  const displayedTab = currentTab || tabs[0].label;

  return (
    <Section
      title="Launch Pads"
      tabs={tabs}
      currentTab={displayedTab}
      changeTab={changeTab}
      upAnchor="launchhistory"
      selfAnchor="launchpads"
      downAnchor="landing"
    >
      {data ? (
        <>
          {displayedTab === tabs[0].label && (
            <>
              <SectionContent>
                <IntegerStat value={data.totalHLC39A} subtitle="Launches" />
              </SectionContent>
              <SectionDescription>
                {`In April 2014, SpaceX signed an agreement with NASA for a 20 year lease on the historic Pad 39A at
                Kennedy Space Center. Since then, SpaceX has constructed a horizontal integration hangar capable of
                holding up to 5 Falcon cores. CRS-10 was the first mission to launch from pad 39A on February
                19th, 2017.`}
              </SectionDescription>
            </>
          )}

          {displayedTab === tabs[1].label && (
            <>
              <SectionContent>
                <IntegerStat value={data.totalSLC40} subtitle="Launches" />
              </SectionContent>
              <SectionDescription>
                {`Cape Canaveral Air Force Station Space Launch Complex 40 (SLC-40), is the launch site of Falcon 9
                carrying Dragon towards the International Space Station, and the starting point for many satellites
                heading into Geostationary Earth Orbit.`}
              </SectionDescription>
            </>
          )}

          {displayedTab === tabs[2].label && (
            <>
              <SectionContent>
                <IntegerStat value={data.totalVAFB} subtitle="Launches" />
              </SectionContent>
              <SectionDescription>
                {`Vandenberg AFB Space Launch Complex 4E (SLC-4E) in California is SpaceX's departure point for satellites
                (mostly scientific and Earth observation) seeking a polar orbit around the Earth. SLC-4E was last used
                in 2005 for the final flight of the Titan IV rocket.`}
              </SectionDescription>
            </>
          )}

          {displayedTab === tabs[3].label && (
            <>
              <SectionContent>
                <IntegerStat value={data.totalBocaChica} subtitle="Launches" />
              </SectionContent>
              <SectionDescription>
                {`Boca Chica Beach, Texas is the location of SpaceX's new private launch site. It is expected to become
                operational not earlier than 2019.`}
              </SectionDescription>
            </>
          )}

          {displayedTab === tabs[4].label && (
            <>
              <SectionContent>
                <IntegerStat value={data.totalKwajalein} subtitle="Launches" />
              </SectionContent>
              <SectionDescription>
                {`Omelek Island in Kwajalein Atoll was SpaceX's first launch site, used exclusively to launch the Falcon
                1. Surrounded by vast amounts of sea and open ocean, making it the perfect site to launch untested
                demonstration rockets. Ironically, this climate also led to the failure of the first Falcon 1 launch,
                during which the engine failed 25 seconds into flight due to a corroded bolt.`}
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

export default LaunchPads;
