import styled from 'styled-components';

import { colorUsages, thresholds } from 'stylesheet';

export const Tab = styled.button`
  display: flex;
  flex-wrap: wrap;

  position: relative;
  z-index: 1;
  display: block;
  padding-left: 0.5rem;
  padding-right: 0.5rem;
  height: 2.5rem;
  line-height: 2.5rem;

  @media (min-width: ${thresholds.sm}) {
    padding-left: 1rem;
    padding-right: 1rem;
    height: 3rem;
    line-height: 3rem;
  }

  text-align: center;
  cursor: pointer;
  border-bottom: 3px solid transparent;
  transition: border-color 0.3s ease-in-out;

  border-color: ${({ active }) =>
    active ? colorUsages.navbarActiveTab : 'transparent'};
`;

export const Wrapper = styled.nav`
  display: flex;
  flex-wrap: wrap;

  @media (min-width: ${thresholds.sm}) {
    ${Tab} {
      margin-left: 1rem;
    }
  }
`;
