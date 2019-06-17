import React, { Fragment } from 'react';
import Section, { SectionContent, SectionDescription } from 'components/Section';
import Ribbon from 'components/Ribbon';
import TableStat from 'components/TableStat';
import TimeStat from 'components/TimeStat';

const Upcoming = ({ currentTab, changeTab, data }) => {
  const tabs = [
    {
      label: 'Up Next',
      background: 'dscovrlaunch.jpg',
      title: data ? data.nextLaunch.payloadName : ''
    },
    {
      label: 'Next Launches',
      background: 'dscovrlaunch.jpg',
      title: 'Next Launches'
    }
  ];
  const displayedTab = currentTab || tabs[0].label;

  return (
    <Section
      title="Upcoming"
      tabs={tabs}
      currentTab={displayedTab}
      changeTab={changeTab}
      selfAnchor="upcoming"
      downAnchor="launchcount"
    >
      {data ? (
        <Fragment>
          {displayedTab === tabs[0].label && (
            <Fragment>
              <Ribbon>{data.nextLaunch.localDate}</Ribbon>
              <SectionContent>
                <TimeStat value={data.nextLaunch.date} type="countdown" />
              </SectionContent>
              <SectionDescription>{data.nextLaunch.payloadDesc}</SectionDescription>
            </Fragment>
          )}

          {displayedTab === tabs[1].label && (
            <Fragment>
              <SectionContent>
                <TableStat
                  config={[
                    {
                      width: '40%',
                      header: 'Mission',
                      renderCell: ({ mission }) => mission
                    },
                    {
                      width: '26%',
                      header: 'Date (UTC)',
                      renderCell: ({ date }) => date
                    },
                    {
                      width: '17%',
                      header: 'Vehicle',
                      renderCell: ({ vehicle }) => vehicle
                    },
                    {
                      width: '17%',
                      header: 'Launchpad',
                      renderCell: ({ launchpad }) => launchpad
                    }
                  ]}
                  data={data.nextLaunches}
                />
              </SectionContent>
            </Fragment>
          )}
        </Fragment>
      ) : (
        <SectionContent />
      )}
    </Section>
  );
};

export default Upcoming;
