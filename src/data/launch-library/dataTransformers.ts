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
  LLAPINetPrecision,
} from './types';

const getRocket = (launch: LLAPILaunch): Rocket | null => {
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

  // SpaceX flies nothing else, so this is a data anomaly rather than a new
  // vehicle. The launch cannot be placed on any per-rocket chart, so it is
  // dropped by transformLaunch rather than failing the whole build.
  console.warn(
    `Unknown rocket type, skipping launch "${launch.name}": ${JSON.stringify(
      launch.rocket.configuration,
    )}`,
  );
  return null;
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
    case LLAPILaunchpadType.starbaseOrbitalPad2:
      return Launchpad.starbase;
    case LLAPILaunchpadType.unknown1:
    case LLAPILaunchpadType.unknown2:
      return Launchpad.unknown;

    default:
      // SpaceX brings new pads online regularly and they show up in upcoming
      // launches first. Everything else about the launch is still usable, so
      // fall back to Unknown instead of failing the whole build.
      console.warn(
        `Unknown launchpad type for launch "${launch.name}": ${JSON.stringify(
          launch.pad,
        )}`,
      );
      return Launchpad.unknown;
  }
};

// `net` alone says nothing about how firm a launch date is: a mission announced
// only for 2027 is published as 2027-12-31T00:00:00Z, which reads as a precise
// day. net_precision is what tells the two apart, and the Upcoming section
// already knows how to render each of these buckets.
const getDatePrecision = (launch: LLAPILaunch): LaunchDatePrecision => {
  switch (launch.net_precision?.id) {
    case LLAPINetPrecision.second:
    case LLAPINetPrecision.minute:
    case LLAPINetPrecision.hour:
      return LaunchDatePrecision.hour;

    // Morning/afternoon are narrower than a day but have no local-time
    // equivalent here, so they round out to the day they fall on.
    case LLAPINetPrecision.morning:
    case LLAPINetPrecision.afternoon:
    case LLAPINetPrecision.day:
      return LaunchDatePrecision.day;

    // No week bucket exists; month understates the precision rather than
    // presenting a specific day the launch is not committed to.
    case LLAPINetPrecision.week:
    case LLAPINetPrecision.month:
      return LaunchDatePrecision.month;

    case LLAPINetPrecision.quarter1:
    case LLAPINetPrecision.quarter2:
    case LLAPINetPrecision.quarter3:
    case LLAPINetPrecision.quarter4:
      return LaunchDatePrecision.quarter;

    case LLAPINetPrecision.yearHalf1:
    case LLAPINetPrecision.yearHalf2:
      return LaunchDatePrecision.half;

    // A fiscal year is not the calendar year `net` sits in, but year is the
    // coarsest bucket available and the decade case is likewise clamped.
    case LLAPINetPrecision.year:
    case LLAPINetPrecision.fiscalYear:
    case LLAPINetPrecision.decade:
      return LaunchDatePrecision.year;

    // Either a precision the API has added since, or a cached payload from
    // before the field existed. Keep the previous assumption.
    default:
      return LaunchDatePrecision.day;
  }
};

export const transformLaunch = (launch: LLAPILaunch): Launch | null => {
  const rocket = getRocket(launch);
  if (rocket === null) {
    return null;
  }

  return {
    id: launch.id,
    name: launch.name,
    date: new Date(launch.net),
    rocket,
    details: launch?.mission?.description ?? launch.failreason,
    upcoming: new Date(launch.net) > new Date(),
    success: launch.status.id === LLAPILaunchStatus.success,
    datePrecision: getDatePrecision(launch),
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
  const transformedLaunches = launches
    .map(transformLaunch)
    .filter((launch): launch is Launch => launch !== null);

  const now = new Date();
  const pastLaunches = transformedLaunches.filter(
    (launch) => launch.date < now,
  );
  const upcomingLaunches = transformedLaunches.filter(
    (launch) => launch.date >= now,
  );

  return {
    buildDate: currentDate,
    pastLaunches,
    upcomingLaunches,
  };
};
