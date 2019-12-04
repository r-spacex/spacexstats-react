import React from 'react';
import Section, { SectionContent, SectionDescription } from 'components/Section';
import IntegerStat from 'components/IntegerStat';

const Starlink = ({ currentTab, changeTab, data }) => {
  const tabs = [
    {
      label: 'Sent In Space',
      background: 'starlink.jpg',
      title: 'Sent In Space'
    }
  ];
  const displayedTab = currentTab || tabs[0].label;

  return (
    <Section
      title="Starlink"
      tabs={tabs}
      currentTab={displayedTab}
      changeTab={changeTab}
      upAnchor="people"
      selfAnchor="starlink"
      downAnchor="starship"
    >
      {data ? (
        <>
          {displayedTab === tabs[0].label && (
            <>
              <SectionContent>
                <IntegerStat value={data.inSpace} subtitle="Satellites" />
              </SectionContent>
              <SectionDescription>
                {`SpaceX is developing a low latency, broadband internet system to meet the needs of consumers across the
                globe. Enabled by a constellation of low Earth orbit satellites, Starlink will provide fast, reliable
                internet to populations with little or no connectivity, including those in rural communities and places
                where existing services are too expensive or unreliable.`}
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

export default Starlink;
