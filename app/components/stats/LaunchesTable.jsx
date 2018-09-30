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
      return date.format('MMM Do YYYY, hh:mm');

    case 'day':
      return date.format('MMM Do YYYY');

    case 'quarter':
      return `Q${getQuarter(date)} ${date.format('YYYY')}`;

    case 'month':
    default:
      return date.format('MMM YYYY');
  }
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

  return (
    <TableStat config={config} data={data} />
  );
};

LaunchesTable.propTypes = {
  data: PropTypes.arrayOf(PropTypes.object).isRequired,
};

export default LaunchesTable;
