import { SpaceXStatsData as SpaceXStatsData } from 'types/index';
import { RSXAPIData } from './types';

export const transformAPIData = ({
  currentBuildDate: { currentDate },
  spacexdatalaunches: { launches },
  spacexdatacores: { cores },
  spacexdatarockets: { rockets },
  spacexdatapayloads: { payloads },
  spacexdatalaunchpads: { launchpads },
  spacexdatalandpads: { landpads },
  spacexdatacrew: { crew },
  spacexdatastarlink: { starlink },
  spacexdatacompany: { company },
  spacexdataroadster: { roadster },
}: RSXAPIData): SpaceXStatsData => {
  const pastLaunches = launches.filter(
    (launch) => !launch.upcoming && launch.success !== null,
  );
  const upcomingLaunches = launches.filter((launch) => launch.upcoming);

  return {
    buildDate: currentDate,
    pastLaunches,
    upcomingLaunches,
    cores,
    rockets,
    payloads,
    launchpads,
    landpads,
    crew,
    starlink,
    company,
    roadster,
  };
};
