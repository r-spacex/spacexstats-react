import PropTypes from 'prop-types';
import React from 'react';

import './TextStat.styl';

const TextStat = ({ data }) => <div className="TextStat text-center text-uppercase">{data}</div>;

TextStat.propTypes = {
  data: PropTypes.string.isRequired
};

export default TextStat;
