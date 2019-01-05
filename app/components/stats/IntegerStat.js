import PropTypes from 'prop-types';
import React from 'react';

import './IntegerStat.styl';

const IntegerStat = props => (
  <div className="IntegerStat text-center">
    <div className="IntegerStat__value">{props.data.value.toLocaleString()}</div>
    <div className="IntegerStat__subtitle text-uppercase">{props.data.subtitle}</div>
  </div>
);

IntegerStat.propTypes = {
  data: PropTypes.shape({
    subtitle: '',
    value: ''
  }).isRequired
};

export default IntegerStat;
