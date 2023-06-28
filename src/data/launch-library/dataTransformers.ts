import {
  Launch,
  LaunchDatePrecision,
  Launchpad,
  Rocket,
  SpaceXStatsData,
} from 'types/index';
import {
  LLAPIData,
  LLAPILaunch,
  LLAPILaunchpadType,
  LLAPILaunchStatus,
} from './types';

const getRocket = (launch: LLAPILaunch): Rocket => {
  if (launch.rocket.configuration.name.includes('Falcon 1')) {
    return Rocket.f1;
  }

  if (launch.rocket.configuration.name.includes('Falcon 9')) {
    return Rocket.f9;
  }

  if (launch.rocket.configuration.name.includes('Falcon Heavy')) {
    return Rocket.fh;
  }

  if (launch.rocket.configuration.name.includes('Starship')) {
    return Rocket.starship;
  }

  throw new Error(`Unknown rocket type: ${JSON.stringify(launch.rocket)}`);
};

const getLaunchpad = (launch: LLAPILaunch): Launchpad => {
  switch (launch.pad.id) {
    case LLAPILaunchpadType.kwajalein:
      return Launchpad.kwajalein;
    case LLAPILaunchpadType.slc40:
      return Launchpad.slc40;
    case LLAPILaunchpadType.lc39a:
    case LLAPILaunchpadType.lc39aStarshipPad:
      return Launchpad.lc39a;
    case LLAPILaunchpadType.vafb:
      return Launchpad.vafb;
    case LLAPILaunchpadType.starbasetestpadA:
    case LLAPILaunchpadType.starbasetestpadB:
    case LLAPILaunchpadType.starbase:
      return Launchpad.starbase;
    case LLAPILaunchpadType.unknown1:
    case LLAPILaunchpadType.unknown2:
      return Launchpad.unknown;

    default:
      throw new Error(`Unknown launchpad type: ${JSON.stringify(launch.pad)}`);
  }
};

export const transformLaunch = (launch: LLAPILaunch): Launch => {
  if (launch.mission === null) {
    1 + 1;
  }
  return {
    id: launch.id,
    name: launch.name,
    date: new Date(launch.net),
    rocket: getRocket(launch),
    details: launch?.mission?.description ?? launch.failreason,
    upcoming: new Date(launch.net) > new Date(),
    success: launch.status.id === LLAPILaunchStatus.success,
    datePrecision: LaunchDatePrecision.day,
    launchpad: getLaunchpad(launch),

    // TODO fill this
    crew: [],
    payloads: [],
    cores: [
      {
        core: '',
        flight: 0,
        landing: null,
        landingSuccess: false,
        reused: false,
      },
    ],
    fairings: {
      reused: false,
      recoveryAttempt: false,
      recovered: false,
    },
  };
};

export const transformAPIData = ({
  currentBuildDate: { currentDate },
  spacexdatalaunches: { launches },
}: LLAPIData): SpaceXStatsData => {
  const transformedLaunches = launches.map(transformLaunch);

  const now = new Date();
  const pastLaunches = transformedLaunches.filter(
    (launch) => launch.date < now,
  );
  const upcomingLaunches = transformedLaunches.filter(
    (launch) => launch.date >= now,
  );

  console.log({ transformedLaunches, d: transformedLaunches });

  return {
    buildDate: currentDate,
    pastLaunches,
    upcomingLaunches,
  };
};
