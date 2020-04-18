import styled from 'styled-components';

import { fonts, thresholds } from 'stylesheet';

export const Wrapper = styled.div`
  display: flex;
  justify-content: space-around;
  ${fonts.special}
  text-transform: uppercase;
`;

export const Value = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  min-width: 2ch;
  line-height: 1;

  font-size: 2.5rem;
  @media (min-width: ${thresholds.sm}) {
    font-size: 7rem;
  }
  @media (min-width: ${thresholds.md}) {
    font-size: 10rem;
  }
`;

export const Subtitle = styled.div`
  font-size: 1rem;
  @media (min-width: ${thresholds.sm}) {
    font-size: 2rem;
  }
`;
