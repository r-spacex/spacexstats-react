import React from 'react';
import Section, {
  SectionContent,
  SectionDescription,
} from 'components/ui/Section';
import Ribbon from 'components/ui/Ribbon';
import TableStat from 'components/ui/TableStat';
import TimeStat from 'components/ui/TimeStat';
import { modelizer, ModelizedUpcomingLaunch } from './modelizer';
import { SpaceXData } from 'types';

const Upcoming: React.FC<SpaceXData> = (data) => {
  const { nextLaunch, nextLaunches } = modelizer(data);

  const tabs = [
    {
      id: 'next',
      label: 'Up Next',
      background: 'dscovrlaunch.jpg',
      title: nextLaunch.mission,
      render: (
        <>
          <Ribbon>{nextLaunch.localDate}</Ribbon>
          <SectionContent>
            <TimeStat value={nextLaunch.date} type="countdown" />
          </SectionContent>
          <SectionDescription>{nextLaunch.description}</SectionDescription>
        </>
      ),
    },
    {
      id: 'next-launches',
      label: 'Next Launches',
      background: 'dscovrlaunch.jpg',
      title: 'Next Launches',
      render: (
        <SectionContent>
          <TableStat
            config={[
              {
                width: '40%',
                header: 'Mission',
                renderCell: ({ mission }: ModelizedUpcomingLaunch) => mission,
              },
              {
                width: '26%',
                header: 'Date (UTC)',
                renderCell: ({ date }: ModelizedUpcomingLaunch) => date,
              },
              {
                width: '17%',
                header: 'Vehicle',
                renderCell: ({ vehicle }: ModelizedUpcomingLaunch) => vehicle,
              },
              {
                width: '17%',
                header: 'Launchpad',
                renderCell: ({ launchpad }: ModelizedUpcomingLaunch) =>
                  launchpad,
              },
            ]}
            rowKey="mission"
            data={nextLaunches}
          />
        </SectionContent>
      ),
    },
    {
      id: 'recent-updates',
      label: 'Recent Updates',
      background: 'dscovrlaunch.jpg',
      title: 'Recent Updates',
      render: (
        <SectionContent>
          <iframe
            width="100%"
            height="100%"
            src="https://www.youtube-nocookie.com/embed/videoseries?list=PLKH6J0WU0gbsJpSO_Awf4wb07BKikj0qr"
            title="SpaceX recaps by Jack Lishman"
            frameBorder="0"
            allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
            style={{ flexGrow: 1 }}
          />
        </SectionContent>
      ),
    },
  ];

  return (
    <Section
      id="upcoming"
      title="Upcoming"
      tabs={tabs}
      downSection="launchcount"
    />
  );
};

export default Upcoming;
