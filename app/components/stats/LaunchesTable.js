import PropTypes from 'prop-types';
import React from 'react';
import moment from 'moment';

import TableStat from './TableStat.jsx';

const getQuarter = date => Math.floor((date.get('month') + 3) / 3);

const displayLaunchTime = (date, precision) => {
  switch (precision) {
    case 'second':
    case 'minute':
    case 'hour':
      return date.format('MMM Do YYYY, HH:mm');

    case 'day':
      return date.format('MMM Do YYYY');

    case 'quarter':
      return `Q${getQuarter(date)} ${date.format('YYYY')}`;

    case 'month':
    default:
      return date.format('MMM YYYY');
  }
};

const sortLaunches = (
  { launch_date_unix: dateA, tentative_max_precision: precisionA },
  { launch_date_unix: dateB, tentative_max_precision: precisionB },
) => {
  if (precisionA === 'quarter' && precisionB === 'quarter') {
    return dateA - dateB;
  }

  const momentA = moment.unix(dateA);
  const momentB = moment.unix(dateB);

  // Priority to day-positioned dates, then months, then quarters
  const quarterA = getQuarter(momentA);
  const quarterB = getQuarter(momentB);
  if (quarterA === quarterB) {
    if (precisionA === 'quarter') {
      return 1;
    }
    if (precisionB === 'quarter') {
      return -1;
    }
  }

  const monthA = momentA.get('month');
  const monthB = momentB.get('month');
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
  const config = [{
    width: '40%',
    header: 'Mission',
    renderCell: ({ mission_name: mission }) => mission,
  }, {
    width: '26%',
    header: 'Date (UTC)',
    renderCell: ({ launch_date_unix: date, tentative_max_precision: precision }) =>
      displayLaunchTime(moment.unix(date), precision),
  }, {
    width: '17%',
    header: 'Vehicle',
    renderCell: ({ rocket: { rocket_name: vehicle } }) => vehicle,
  }, {
    width: '17%',
    header: 'Launchpad',
    renderCell: ({ launch_site: { site_name: launchpad } }) => launchpad,
  }];

  // Sort data by date
  data.sort(sortLaunches);

  return (
    <TableStat config={config} data={data} />
  );
};

LaunchesTable.propTypes = {
  data: PropTypes.arrayOf(PropTypes.object).isRequired,
};

export default LaunchesTable;
