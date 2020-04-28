import styled from 'styled-components';

import { fonts, thresholds } from 'stylesheet';

const TextStat = styled.div`
  ${fonts.special}
  text-align: center;
  text-transform: uppercase;

  font-size: 2.5rem;
  @media (min-width: ${thresholds.sm}) {
    font-size: 6rem;
  }
`;

export default TextStat;
