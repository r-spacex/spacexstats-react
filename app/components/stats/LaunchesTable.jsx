import PropTypes from 'prop-types';
import React from 'react';
import moment from 'moment';

import TableStat from './TableStat.jsx';

const LaunchesTable = ({ data }) => {
  const config = [{
    width: '40%',
    header: 'Mission',
    renderCell: ({ mission_name: mission }) => mission,
  }, {
    width: '26%',
    header: 'Date (UTC)',
    renderCell: ({ launch_date_unix: date, tentative_max_precision: precision }) => {
      let format;

      switch (precision) {
        case 'second':
        case 'minute':
        case 'hour':
          format = 'MMM Do YYYY, hh:mm';
          break;

        case 'day':
          format = 'MMM Do YYYY';
          break;

        default:
          format = 'MMM YYYY';
      }
      return moment.unix(date).format(format);
    },
  }, {
    width: '17%',
    header: 'Vehicule',
    renderCell: ({ rocket: { rocket_name: vehicule } }) => vehicule,
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
