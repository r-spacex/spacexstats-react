import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';

import { fonts, thresholds } from 'stylesheet';

const Wrapper = styled.div`
  ${fonts.special}
  text-align: center;
  text-transform: uppercase;

  font-size: 3rem;
  @media (min-width: ${thresholds.sm}) {
    font-size: 7rem;
  }
`;

const TextStat = ({ value }) => <Wrapper>{value}</Wrapper>;

TextStat.propTypes = {
  value: PropTypes.string.isRequired,
};

export default TextStat;
