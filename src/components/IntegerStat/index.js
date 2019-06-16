import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';

import { fonts, thresholds } from 'stylesheet';

const Wrapper = styled.div`
  ${fonts.special}
  text-align: center;
  text-transform: uppercase;
  line-height: 1;

  font-size: 5rem;
  @media (min-width: ${thresholds.sm}) {
    font-size: 10rem;
  }
`;

const Subtitle = styled.div`
  margin-top: 1rem;
  font-size: 1.5rem;
  @media (min-width: ${thresholds.sm}) {
    font-size: 2rem;
  }
`;

const IntegerStat = ({ value, subtitle }) => (
  <Wrapper>
    {value.toLocaleString()}
    {subtitle && <Subtitle>{subtitle}</Subtitle>}
  </Wrapper>
);

IntegerStat.defaultProps = {
  subtitle: null
};

IntegerStat.propTypes = {
  subtitle: PropTypes.string,
  value: PropTypes.number.isRequired
};

export default IntegerStat;
