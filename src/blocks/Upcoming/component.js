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
      title: data ? data.nextLaunch.missionName : ''
    },
    {
      label: 'Next Launches',
      background: 'dscovrlaunch.jpg',
      title: 'Next Launches'
    },
    {
      label: 'Recent Updates',
      background: 'dscovrlaunch.jpg',
      title: 'Recent Updates'
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

          {displayedTab === tabs[2].label && (
            <Fragment>
              <SectionContent>
                <iframe
                  width="100%"
                  height="100%"
                  src="https://www.youtube-nocookie.com/embed/videoseries?list=PLKH6J0WU0gbsJpSO_Awf4wb07BKikj0qr"
                  title="SpaceX recaps by Jack Lishman"
                  frameBorder="0"
                  allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture"
                  allowFullscreen
                  style={{ flexGrow: 1 }}
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
