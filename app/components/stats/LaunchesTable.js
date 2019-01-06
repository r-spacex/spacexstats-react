import PropTypes from 'prop-types';
import React from 'react';
import format from 'date-fns/format';
import { fromUnix } from '~/utils';

import TableStat from './TableStat';

const getQuarter = date => Math.floor((date.getMonth() + 3) / 3);

const displayLaunchTime = (date, precision) => {
  switch (precision) {
    case 'second':
    case 'minute':
    case 'hour':
      return format(date, 'MMM Do YYYY, HH:mm');

    case 'day':
      return format(date, 'MMM Do YYYY');

    case 'quarter':
      return `Q${getQuarter(date)} ${format(date, 'YYYY')}`;

    case 'month':
    default:
      return format(date, 'MMM YYYY');
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

const LaunchesTable = ({ data }) => {
  const config = [
    {
      width: '40%',
      header: 'Mission',
      renderCell: ({ mission_name: mission }) => mission
    },
    {
      width: '26%',
      header: 'Date (UTC)',
      renderCell: ({ launch_date_unix: date, tentative_max_precision: precision }) =>
        displayLaunchTime(fromUnix(date), precision)
    },
    {
      width: '17%',
      header: 'Vehicle',
      renderCell: ({ rocket: { rocket_name: vehicle } }) => vehicle
    },
    {
      width: '17%',
      header: 'Launchpad',
      renderCell: ({ launch_site: { site_name: launchpad } }) => launchpad
    }
  ];

  // Sort data by date
  data.sort(sortLaunches);

  return <TableStat config={config} data={data} />;
};

LaunchesTable.propTypes = {
  data: PropTypes.arrayOf(PropTypes.object).isRequired
};

export default LaunchesTable;
