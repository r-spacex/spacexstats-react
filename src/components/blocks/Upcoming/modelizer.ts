import format from 'date-fns/format';
import getQuarter from 'date-fns/getQuarter';
import { launchYear, getPayload } from 'utils/launch';
import { Launch, SpaceXStatsData, LaunchDatePrecision } from 'types';

export interface ModelizedUpcomingLaunch {
  mission: string;
  date: string;
  vehicle: string;
  launchpad: string;
}

export interface ModelizedSectionData {
  nextLaunch: {
    mission: string;
    localDate: string;
    date: Date;
    payload: string;
    description: string;
  } | null;
  nextLaunches: ModelizedUpcomingLaunch[];
}

const displayLaunchTime = (date: Date, precision: LaunchDatePrecision) => {
  switch (precision) {
    case LaunchDatePrecision.hour:
      return format(date, 'MMM do yyyy, HH:mm');

    case LaunchDatePrecision.day:
      return format(date, 'MMM do yyyy');

    case LaunchDatePrecision.half:
    case LaunchDatePrecision.quarter:
      return `Q${getQuarter(date)} ${format(date, 'yyyy')}`;

    case LaunchDatePrecision.month:
      return format(date, 'MMM yyyy');

    case LaunchDatePrecision.year:
      return format(date, 'yyyy');

    default:
      return 'Invalid date';
  }
};

// eslint-disable-next-line
const sortLaunches = (launchA: Launch, launchB: Launch) => {
  const yearA = launchYear(launchA);
  const yearB = launchYear(launchB);

  // This is the logic: better precision always comes first in the same time scale
  // Are these launches the same year?
  if (yearA > yearB) {
    return 1;
  }
  if (yearA < yearB) {
    return -1;
  }

  // These launches are the same year, is one of them more precise?
  const precisionA = launchA.datePrecision;
  const precisionB = launchB.datePrecision;
  if (
    precisionA === LaunchDatePrecision.year &&
    precisionB !== LaunchDatePrecision.year
  ) {
    return 1;
  }
  if (
    precisionA !== LaunchDatePrecision.year &&
    precisionB === LaunchDatePrecision.year
  ) {
    return -1;
  }

  // Now the launches are the same year and same precision
  // Are these launches the same quarter?
  const dateA = launchA.date;
  const dateB = launchB.date;
  const quarterA = getQuarter(dateA);
  const quarterB = getQuarter(dateB);

  if (quarterA > quarterB) {
    return 1;
  }
  if (quarterA < quarterB) {
    return -1;
  }

  // These launches are the same quarter, is one of them more precise?
  if (
    (precisionA === LaunchDatePrecision.half &&
      precisionB !== LaunchDatePrecision.half) ||
    (precisionA === LaunchDatePrecision.quarter &&
      precisionB !== LaunchDatePrecision.quarter)
  ) {
    return 1;
  }
  if (
    (precisionA !== LaunchDatePrecision.half &&
      precisionB === LaunchDatePrecision.half) ||
    (precisionA !== LaunchDatePrecision.quarter &&
      precisionB === LaunchDatePrecision.quarter)
  ) {
    return -1;
  }

  // Are these launches the same month?
  const monthA = dateA.getMonth();
  const monthB = dateB.getMonth();
  if (monthA > monthB) {
    return 1;
  }
  if (monthA < monthB) {
    return -1;
  }

  // These launches are the same month, is one of them more precise?
  if (
    precisionA === LaunchDatePrecision.month &&
    precisionB !== LaunchDatePrecision.month
  ) {
    return 1;
  }
  if (
    precisionA !== LaunchDatePrecision.month &&
    precisionB === LaunchDatePrecision.month
  ) {
    return -1;
  }

  return dateA.getTime() - dateB.getTime();
};

const getPayloadDescription = (launch: Launch): string => {
  if (launch.details) {
    return launch.details;
  }

  const payloads = launch.payloads;
  if (payloads.length === 0) {
    return 'Unknown payload given for this mission. This description may be updated later!';
  }
  const payloadMass = payloads.reduce(
    (total, current) => (total += current.mass ?? 0),
    0,
  );
  const payloadNames = payloads.map((payload) => payload.name);

  if (payloads[0].type.indexOf('Dragon') !== -1) {
    return `A SpaceX Dragon capsule will launch into LEO atop a ${launch.rocket} rocket from ${launch.launchpad}, carrying ${payloadMass} kg of supplies and scientific cargo to the International Space Station.`;
  }

  return `A SpaceX ${launch.rocket} rocket will launch from
  ${launch.launchpad}, lofting the
  ${payloadMass > 0 ? `${payloadMass} kg ` : ''}
  satellite${payloads.length > 1 ? 's ' : ' '}
  ${payloadNames.join('/')} to a
  ${payloads[0].orbit} trajectory.`;
};

export const modelizer = ({
  upcomingLaunches,
}: SpaceXStatsData): ModelizedSectionData => {
  const nextLaunches = upcomingLaunches.map((launch) => launch);
  nextLaunches.sort(sortLaunches);

  // Find first launch with non-null launch date
  const nextLaunch = nextLaunches.find(
    (launch) => launch.date !== null && launch.date > new Date(),
  );

  if (nextLaunch === undefined || nextLaunch?.date === null) {
    console.error('No upcoming launch found with a valid launch date');
  }

  return {
    nextLaunch:
      nextLaunch !== undefined
        ? {
            mission: nextLaunch.name,
            localDate: format(nextLaunch.date, "MMM do, h:mma ('UTC'xxx)"),
            date: nextLaunch.date,
            payload: getPayload(nextLaunch)?.name ?? 'Unkown payload',
            description: getPayloadDescription(nextLaunch),
          }
        : null,
    nextLaunches: nextLaunches.map((launch) => ({
      mission: launch.name,
      date: displayLaunchTime(launch.date, launch.datePrecision),
      vehicle: launch.rocket,
      launchpad: launch.launchpad,
    })),
  };
};
