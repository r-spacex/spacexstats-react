import PropTypes from 'prop-types';
import React from 'react';

import './TextStat.styl';

const TextStat = props => (
  <div className="TextStat text-center text-uppercase">{props.data}</div>
);

TextStat.propTypes = {
  data: PropTypes.string.isRequired,
};

export default TextStat;
