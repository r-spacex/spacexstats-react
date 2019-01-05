import PropTypes from 'prop-types';
import React from 'react';

import './Ribbon.styl';

const Ribbon = ({ text }) => (
  <div className="Ribbon">
    <div className="Ribbon__text text-center text-uppercase">{text}</div>
  </div>
);

Ribbon.propTypes = {
  text: PropTypes.string.isRequired
};

export default Ribbon;
