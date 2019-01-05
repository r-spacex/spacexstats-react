import PropTypes from 'prop-types';
import React from 'react';

import './IntegerStat.styl';

const IntegerStat = ({ data: { value, subtitle } }) => (
  <div className="IntegerStat text-center">
    <div className="IntegerStat__value">{value.toLocaleString()}</div>
    <div className="IntegerStat__subtitle text-uppercase">{subtitle}</div>
  </div>
);

IntegerStat.propTypes = {
  data: PropTypes.shape({
    subtitle: '',
    value: ''
  }).isRequired
};

export default IntegerStat;
