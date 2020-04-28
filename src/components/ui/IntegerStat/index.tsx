import React from 'react';
import styled from 'styled-components';
import { fonts, getSpacing, thresholds } from 'stylesheet';

const Wrapper = styled.div`
  ${fonts.special}
  text-align: center;
  text-transform: uppercase;
  line-height: 1;

  font-size: 4rem;
  @media (min-width: ${thresholds.sm}) {
    font-size: 8rem;
  }
`;

const Subtitle = styled.div`
  margin-top: ${getSpacing(2)};
  font-size: 1.5rem;
  @media (min-width: ${thresholds.sm}) {
    font-size: 2rem;
  }
`;

interface Props {
  subtitle?: string;
  value: number;
}

const IntegerStat: React.FC<Props> = ({ value, subtitle }) => (
  <Wrapper>
    {value.toLocaleString()}
    {subtitle && <Subtitle>{subtitle}</Subtitle>}
  </Wrapper>
);

export default IntegerStat;
