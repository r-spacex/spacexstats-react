import format from 'date-fns/format';
import getQuarter from 'date-fns/getQuarter';
import { fromUnix } from 'utils/date';
import { Launch, SpaceXData, LaunchDatePrecision } from 'types';

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
  };
  nextLaunches: ModelizedUpcomingLaunch[];
}

const displayLaunchTime = (date: Date, precision: LaunchDatePrecision) => {
  switch (precision) {
    case LaunchDatePrecision.second:
    case LaunchDatePrecision.minute:
    case LaunchDatePrecision.hour:
      return format(date, 'MMM do yyyy, HH:mm');

    case LaunchDatePrecision.day:
      return format(date, 'MMM do yyyy');

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

const sortLaunches = (launchA: Launch, launchB: Launch) => {
  const yearA = parseInt(launchA.launch_year);
  const yearB = parseInt(launchB.launch_year);

  // This is the logic: better precision always comes first in the same time scale
  // Are these launches the same year?
  if (yearA > yearB) {
    return 1;
  }
  if (yearA < yearB) {
    return -1;
  }

  // These launches are the same year, is one of them more precise?
  const precisionA = launchA.tentative_max_precision;
  const precisionB = launchB.tentative_max_precision;
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
  const dateA = fromUnix(launchA.launch_date_unix);
  const dateB = fromUnix(launchB.launch_date_unix);
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
    precisionA === LaunchDatePrecision.quarter &&
    precisionB !== LaunchDatePrecision.quarter
  ) {
    return 1;
  }
  if (
    precisionA !== LaunchDatePrecision.quarter &&
    precisionB === LaunchDatePrecision.quarter
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

  return launchA.launch_date_unix - launchB.launch_date_unix;
};

const getPayloadDescription = (launch: Launch): string => {
  if (launch.details) {
    return launch.details;
  }

  const payloads = launch.rocket.second_stage.payloads;
  const payloadMass = payloads.reduce(
    (total, current) => (total += current.payload_mass_kg),
    0,
  );
  const payloadNames = payloads.map((payload) => payload.payload_id);

  if (payloads[0].payload_type.indexOf('Dragon') !== -1) {
    return `A SpaceX Dragon capsule will launch into LEO atop a ${launch.rocket.rocket_name} rocket from ${launch.launch_site.site_name}, carrying ${payloadMass} kg of supplies and scientific cargo to the International Space Station.`;
  }

  return `A SpaceX ${launch.rocket.rocket_name} rocket will launch from 
  ${launch.launch_site.site_name}, lofting the 
  ${payloadMass > 0 ? `${payloadMass} kg ` : ''} 
  satellite${payloads.length > 1 ? 's ' : ' '}
  ${payloadNames.join('/')} to a 
  ${launch.rocket.second_stage.payloads[0].orbit} trajectory.`;
};

export const modelizer = ({
  upcomingLaunches,
}: SpaceXData): ModelizedSectionData => {
  // Find first launch with non-null launch date
  const nextLaunch =
    upcomingLaunches.find((launch) => launch.launch_date_utc !== null) ||
    upcomingLaunches[0];

  const nextLaunches = upcomingLaunches.map((launch) => launch);
  nextLaunches.sort(sortLaunches);

  return {
    nextLaunch: {
      mission: nextLaunch.mission_name,
      localDate: format(
        fromUnix(nextLaunch.launch_date_unix),
        "MMM do, h:mm:ssa ('UTC'xxx)",
      ),
      date: fromUnix(nextLaunch.launch_date_unix),
      payload: nextLaunch.rocket.second_stage.payloads[0]?.payload_id,
      description: getPayloadDescription(nextLaunch),
    },
    nextLaunches: nextLaunches.map((launch) => ({
      mission: launch.mission_name,
      date: displayLaunchTime(
        fromUnix(launch.launch_date_unix),
        launch.tentative_max_precision,
      ),
      vehicle: launch.rocket.rocket_name,
      launchpad: launch.launch_site.site_name,
    })),
  };
};
