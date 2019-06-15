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
  font-size: 1.5rem;
  @media (min-width: ${thresholds.sm}) {
    font-size: 2rem;
  }
`;

const IntegerStat = ({ data: { value, subtitle } }) => (
  <Wrapper>
    {value.toLocaleString()}
    <Subtitle>{subtitle}</Subtitle>
  </Wrapper>
);

IntegerStat.propTypes = {
  data: PropTypes.shape({
    subtitle: '',
    value: ''
  }).isRequired
};

export default IntegerStat;
