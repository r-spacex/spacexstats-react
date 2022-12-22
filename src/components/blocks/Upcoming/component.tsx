import React from 'react';
import Section, {
  SectionContent,
  SectionDescription,
} from 'components/ui/Section';
import Ribbon, { ribbonHeight } from 'components/ui/Ribbon';
import {
  TableContainer,
  Table,
  TableHeader,
  TableHeaderRow,
  TableBody,
  TableRow,
  TableCell,
} from 'components/ui/Table';
import TimeStat from 'components/ui/TimeStat';
import { modelizer, ModelizedUpcomingLaunch } from './modelizer';
import { BlockProps } from 'types';
import TextStat from 'components/ui/TextStat';

const Upcoming: React.FC<BlockProps> = ({ data, ...rest }) => {
  const { nextLaunch, nextLaunches } = modelizer(data);

  const tabs = [
    {
      id: 'next',
      label: 'Up Next',
      background: 'falcon9block5.jpg',
      title: nextLaunch?.mission ?? 'No upcoming launch!',
      render:
        nextLaunch !== null ? (
          <>
            <Ribbon>{nextLaunch.localDate}</Ribbon>
            <SectionContent style={{ marginTop: ribbonHeight }}>
              <TimeStat value={nextLaunch.date} type="countdown" />
            </SectionContent>
            <SectionDescription>{nextLaunch.description}</SectionDescription>
          </>
        ) : (
          <>
            <SectionContent style={{ marginTop: ribbonHeight }}>
              <TextStat>No upcoming</TextStat>
            </SectionContent>
            <SectionDescription>
              The r/SpaceX API may not be updated with the next launch yet.
            </SectionDescription>
          </>
        ),
    },
    {
      id: 'next-launches',
      label: 'Next Launches',
      background: 'asds.jpg',
      title: 'Next Launches',
      render: (
        <SectionContent>
          <TableContainer>
            <Table>
              <TableHeader>
                <TableHeaderRow>
                  <TableCell as="th" style={{ width: '40%' }}>
                    Mission
                  </TableCell>
                  <TableCell as="th" style={{ width: '26%' }}>
                    Date (UTC)
                  </TableCell>
                  <TableCell as="th" style={{ width: '17%' }}>
                    Vehicle
                  </TableCell>
                  <TableCell as="th" style={{ width: '17%' }}>
                    Launchpad
                  </TableCell>
                </TableHeaderRow>
              </TableHeader>
              <TableBody>
                {nextLaunches.map(
                  ({
                    mission,
                    date,
                    vehicle,
                    launchpad,
                  }: ModelizedUpcomingLaunch) => (
                    <TableRow key={mission}>
                      <TableCell>{mission}</TableCell>
                      <TableCell>{date}</TableCell>
                      <TableCell>{vehicle}</TableCell>
                      <TableCell>{launchpad}</TableCell>
                    </TableRow>
                  ),
                )}
                {nextLaunches.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={4}>No launches to display</TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </TableContainer>
        </SectionContent>
      ),
    },
  ];

  return <Section title="Upcoming" tabs={tabs} {...rest} />;
};

export default Upcoming;
