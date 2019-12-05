import format from 'date-fns/format';
import { fromUnix } from 'utils';

const getQuarter = date => Math.floor((date.getMonth() + 3) / 3);

const displayLaunchTime = (date, precision) => {
  switch (precision) {
    case 'second':
    case 'minute':
    case 'hour':
      return format(date, 'MMM do yyyy, HH:mm');

    case 'day':
      return format(date, 'MMM do yyyy');

    case 'quarter':
      return `Q${getQuarter(date)} ${format(date, 'yyyy')}`;

    case 'month':
    default:
      return format(date, 'MMM yyyy');
  }
};

const sortLaunches = (
  { launch_date_unix: dateAUnix, tentative_max_precision: precisionA },
  { launch_date_unix: dateBUnix, tentative_max_precision: precisionB }
) => {
  if (precisionA === 'quarter' && precisionB === 'quarter') {
    return dateAUnix - dateBUnix;
  }

  const dateA = fromUnix(dateAUnix);
  const dateB = fromUnix(dateBUnix);

  // Priority to day-positioned dates, then months, then quarters
  const quarterA = getQuarter(dateA);
  const quarterB = getQuarter(dateB);
  if (quarterA === quarterB) {
    if (precisionA === 'quarter') {
      return 1;
    }
    if (precisionB === 'quarter') {
      return -1;
    }
  }

  const monthA = dateA.getMonth();
  const monthB = dateB.getMonth();
  if (monthA === monthB) {
    if (precisionA === 'month') {
      return 1;
    }
    if (precisionB === 'month') {
      return -1;
    }
  }

  return dateA - dateB;
};

const modelizer = ({ upcomingLaunches }) => {
  // Find first launch with non-null launch date
  let i = 0;
  let nextLaunch = upcomingLaunches[i];
  while (nextLaunch.launch_date_utc === null && i < upcomingLaunches.length - 1) {
    nextLaunch = upcomingLaunches[i];
    i += 1;
  }

  const payloadNames = [];
  let payloadMass = 0;

  nextLaunch.rocket.second_stage.payloads.forEach(payload => {
    payloadNames.push(payload.payload_id);
    payloadMass += payload.payload_mass_kg;
  });
  const payloadName = payloadNames.join('/');

  let payloadDesc = '';
  if (nextLaunch.rocket.second_stage.payloads[0].payload_type.indexOf('Dragon') !== -1) {
    payloadDesc = `A SpaceX Dragon capsule will launch into LEO atop a
                    ${nextLaunch.rocket.rocket_name} rocket from
                    ${nextLaunch.launch_site.site_name_long}, carrying
                    ${payloadMass} kg of supplies and scientific cargo to the
                    International Space Station.`;
  } else {
    payloadDesc = `A SpaceX ${nextLaunch.rocket.rocket_name} rocket will launch from
                    ${nextLaunch.launch_site.site_name_long},
                    lofting the ${payloadMass > 0 ? `${payloadMass} kg ` : ''}
                    satellite${nextLaunch.rocket.second_stage.payloads.length > 1 ? 's ' : ' '}
                    ${payloadName} to a ${nextLaunch.rocket.second_stage.payloads[0].orbit} trajectory.`;
  }

  payloadDesc += ' ';

  const nextLaunches = upcomingLaunches.map(launch => ({
    mission: launch.mission_name,
    date: displayLaunchTime(fromUnix(launch.launch_date_unix), launch.tentative_max_precision),
    vehicule: launch.rocket.rocket_name,
    launchpad: launch.launch_site.site_name
  }));
  nextLaunches.sort(sortLaunches);

  return {
    nextLaunch: {
      missionName: nextLaunch.mission_name,
      localDate: format(fromUnix(nextLaunch.launch_date_unix), "MMM do, h:mm:ssa ('UTC'xxx)"),
      date: fromUnix(nextLaunch.launch_date_unix),
      payloadName,
      payloadDesc
    },
    nextLaunches
  };
};

export default modelizer;
