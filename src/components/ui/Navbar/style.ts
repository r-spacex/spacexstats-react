import styled from 'styled-components';
import { getSpacing, palette, thresholds } from 'stylesheet';

interface TabProps {
  active: boolean;
}

const TAB_HEIGHT = '40px';

export const Tab = styled.button<TabProps>`
  display: flex;
  flex-wrap: wrap;

  position: relative;
  z-index: 1;
  display: block;
  padding-left: ${getSpacing(1)};
  padding-right: ${getSpacing(1)};
  height: ${TAB_HEIGHT};
  line-height: ${TAB_HEIGHT};

  @media (min-width: ${thresholds.sm}) {
    padding-left: ${getSpacing(2)};
    padding-right: ${getSpacing(2)};
  }

  text-align: center;
  cursor: pointer;
  border-bottom: 3px solid transparent;
  border-color: ${({ active }) => (active ? palette.yellow : 'transparent')};
  transition: border-color 0.3s ease-in-out;

  :focus {
    border-color: ${({ active }) => (active ? palette.yellow : palette.grey)};
  }
`;

export const Wrapper = styled.nav`
  display: flex;
  flex-wrap: wrap;

  @media (min-width: ${thresholds.sm}) {
    ${Tab} {
      margin-left: ${getSpacing(2)};
    }
  }
`;
