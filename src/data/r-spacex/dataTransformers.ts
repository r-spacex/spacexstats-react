import {
  Launch,
  LaunchDatePrecision,
  SpaceXStatsData,
  Rocket,
  Launchpad,
  Core,
  CoreStatus,
  CoreLaunch,
  Landpad,
  Payload,
  Orbit,
  FairingsLaunch,
} from 'types/index';
import { fromUnix } from 'utils/date';
import {
  RSXAPICore,
  RSXAPICoreStatus,
  RSXAPIData,
  RSXAPILandpadType,
  RSXAPILaunch,
  RSXAPILaunchCore,
  RSXAPILaunchDatePrecision,
  RSXAPILaunchpadType,
  RSXAPIOrbit,
  RSXAPIPayload,
  RSXAPIRocketType,
} from './types';

const getLandpad = (coreLaunch: RSXAPILaunchCore): Landpad | null => {
  switch (coreLaunch.landpad) {
    case RSXAPILandpadType.lz1:
      return Landpad.lz1;
    case RSXAPILandpadType.lz2:
      return Landpad.lz2;
    case RSXAPILandpadType.lz4:
      return Landpad.lz4;
    case RSXAPILandpadType.jrtiv1:
      return Landpad.jrtiv1;
    case RSXAPILandpadType.jrti:
      return Landpad.jrti;
    case RSXAPILandpadType.ocisly:
      return Landpad.ocisly;
    case RSXAPILandpadType.asog:
      return Landpad.asog;
    case null:
      return null;

    default:
      throw new Error(`Unknown landpad: ${coreLaunch.landpad}`);
  }
};

const transformCoreLaunch = (launchCore: RSXAPILaunchCore): CoreLaunch => ({
  ...launchCore,
  landingSuccess: launchCore.landing_success,
  landing: getLandpad(launchCore),
});

const getLaunchpad = (launch: RSXAPILaunch): Launchpad => {
  switch (launch.launchpad) {
    case RSXAPILaunchpadType.kwajalein:
      return Launchpad.kwajalein;
    case RSXAPILaunchpadType.slc40:
      return Launchpad.slc40;
    case RSXAPILaunchpadType.lc39a:
      return Launchpad.lc39a;
    case RSXAPILaunchpadType.vafb:
      return Launchpad.vafb;

    default:
      throw new Error(`Unknown launchpad type: ${launch.launchpad}`);
  }
};

const getRocket = (launch: RSXAPILaunch): Rocket => {
  switch (launch.rocket) {
    case RSXAPIRocketType.f1:
      return Rocket.f1;
    case RSXAPIRocketType.f9:
      return Rocket.f9;
    case RSXAPIRocketType.fh:
      return Rocket.fh;
    case RSXAPIRocketType.starship:
      return Rocket.starship;
    default:
      throw new Error(`Unknown rocket type: ${launch.rocket}`);
  }
};

const getLaunchDatePrecision = (launch: RSXAPILaunch): LaunchDatePrecision => {
  switch (launch.date_precision) {
    case RSXAPILaunchDatePrecision.year:
      return LaunchDatePrecision.year;
    case RSXAPILaunchDatePrecision.half:
      return LaunchDatePrecision.half;
    case RSXAPILaunchDatePrecision.quarter:
      return LaunchDatePrecision.quarter;
    case RSXAPILaunchDatePrecision.month:
      return LaunchDatePrecision.month;
    case RSXAPILaunchDatePrecision.day:
      return LaunchDatePrecision.day;
    case RSXAPILaunchDatePrecision.hour:
      return LaunchDatePrecision.hour;
    default:
      throw new Error(
        `Unknown launch date precision: ${launch.date_precision}`,
      );
  }
};

const transformFairingsLaunch = (launch: RSXAPILaunch): FairingsLaunch | null =>
  launch.fairings !== null
    ? {
        ...launch.fairings,
        recoveryAttempt: launch.fairings.recovery_attempt,
      }
    : null;

const transformLaunch = (
  launch: RSXAPILaunch,
  allPayloads: RSXAPIPayload[],
): Launch => ({
  ...launch,
  upcoming: launch.upcoming || launch.success === null,
  datePrecision: getLaunchDatePrecision(launch),
  rocket: getRocket(launch),
  date: fromUnix(launch.date_unix),
  launchpad: getLaunchpad(launch),
  cores: launch.cores.map(transformCoreLaunch),
  fairings: transformFairingsLaunch(launch),
  payloads: allPayloads
    .filter((payload) => launch.payloads.includes(payload.id))
    .map(transformPayload),
});

const getCoreStatus = (core: RSXAPICore): CoreStatus => {
  switch (core.status) {
    case RSXAPICoreStatus.active:
      return CoreStatus.active;
    case RSXAPICoreStatus.expended:
      return CoreStatus.expended;
    case RSXAPICoreStatus.inactive:
      return CoreStatus.inactive;
    case RSXAPICoreStatus.lost:
      return CoreStatus.lost;
    case RSXAPICoreStatus.retired:
      return CoreStatus.retired;
    case RSXAPICoreStatus.unknown:
      return CoreStatus.unknown;
    default:
      throw new Error(`Unknown core status: ${core.status}`);
  }
};

const transformCore = (core: RSXAPICore): Core => ({
  ...core,
  status: getCoreStatus(core),
  reuseCount: core.reuse_count,
});

const getOrbit = (payload: RSXAPIPayload): Orbit | null => {
  switch (payload.orbit) {
    case RSXAPIOrbit.esl1:
    case RSXAPIOrbit.hco:
    case RSXAPIOrbit.heo:
    case RSXAPIOrbit.beo:
      return Orbit.interplanetary;
    case RSXAPIOrbit.tli:
      return Orbit.cislunar;
    case RSXAPIOrbit.gto:
    case RSXAPIOrbit.geo:
      return Orbit.gto;
    case RSXAPIOrbit.iss:
      return Orbit.iss;
    case RSXAPIOrbit.vleo:
    case RSXAPIOrbit.leo:
      return Orbit.leo;
    case RSXAPIOrbit.meo:
      return Orbit.meo;
    case RSXAPIOrbit.po:
      return Orbit.po;
    case RSXAPIOrbit.sso:
      return Orbit.sso;
    case RSXAPIOrbit.suborbital:
      return Orbit.suborbital;

    case null:
      return null;

    default:
      throw new Error(`Unknown orbit: ${payload.orbit}`);
  }
};

const transformPayload = (payload: RSXAPIPayload): Payload => ({
  ...payload,
  orbit: getOrbit(payload),
  mass: payload.mass_kg,
  noradIds: payload.norad_ids,
  dragon: {
    massReturned: payload.dragon.mass_returned_kg,
    flightTime: payload.dragon.flight_time_sec,
  },
});

export const transformAPIData = ({
  currentBuildDate: { currentDate },
  spacexdatalaunches: { launches },
  spacexdatacores: { cores },
  spacexdatapayloads: { payloads },
  spacexdatacrew: { crew },
  spacexdatastarlink: { starlink },
  spacexdatacompany: { company },
  spacexdataroadster: { roadster },
}: RSXAPIData): SpaceXStatsData => {
  const transformedLaunches = launches.map((launch) =>
    transformLaunch(launch, payloads),
  );

  const pastLaunches = transformedLaunches.filter(
    (launch) => !launch.upcoming && launch.success !== null,
  );
  const upcomingLaunches = transformedLaunches.filter(
    (launch) => launch.upcoming,
  );

  return {
    buildDate: currentDate,
    pastLaunches,
    upcomingLaunches,
    cores: cores.map(transformCore),
    crew,
    starlink,
    company,
    roadster,
  };
};
